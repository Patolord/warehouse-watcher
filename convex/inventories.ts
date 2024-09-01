import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import {
  query,
  mutation,
  MutationCtx,
  DatabaseReader,
  ActionCtx,
} from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { auth } from "./auth"; // Import auth instead of getUserId

export const updateInventory = mutation({
  args: {
    fromWarehouse: v.optional(v.id("warehouses")),
    toWarehouse: v.optional(v.id("warehouses")),
    actionType: v.union(
      v.literal("transfered"),
      v.literal("added"),
      v.literal("removed")
    ),
    materials: v.array(
      v.object({
        materialId: v.id("materials"),
        materialVersion: v.optional(v.id("materialVersions")),
        quantity: v.number(),
      })
    ),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { fromWarehouse, toWarehouse, actionType, materials } = args;

    const fullUserId = await auth.getUserId(ctx);
    if (!fullUserId) {
      throw new ConvexError("User not authenticated");
    }
    // Extract the part before the '|' character
    const userId = fullUserId.split('|')[0];

    // Create the transaction
    const transactionId = await ctx.db.insert("transactions", {
      userId: userId,
      from_location: fromWarehouse,
      to_location: toWarehouse,
      action_type: actionType,
      description: args.description,
    });

    // Process each material
    for (const { materialId, materialVersion, quantity } of materials) {
      // Get the current material to access its current version
      const material = await ctx.db.get(materialId);
      if (!material) {
        throw new ConvexError(`Material with ID ${materialId} not found`);
      }

      // Determine which version ID to use
      let versionIdToUse: Id<"materialVersions">;
      if (materialVersion) {
        versionIdToUse = materialVersion;
      } else if (material.currentVersionId) {
        versionIdToUse = material.currentVersionId;
      } else {
        // If no version is specified and the material doesn't have a current version,
        // we need to handle this case. Here, we'll create a new version.
        versionIdToUse = await ctx.db.insert("materialVersions", {
          materialId,
          name: material.name,
          type: material.type,
          versionNumber: 1,
        });
        await ctx.db.patch(materialId, { currentVersionId: versionIdToUse });
      }

      // Insert transaction details with both materialId and materialVersionId
      await ctx.db.insert("transactions_details", {
        transaction: transactionId,
        materialId: materialId,
        materialVersionId: versionIdToUse,
        quantity,
      });

      // Update inventory based on action type
      if (actionType === "transfered") {
        if (!fromWarehouse || !toWarehouse) {
          throw new ConvexError(
            "Both fromWarehouse and toWarehouse are required for transfers"
          );
        }
        await updateWarehouseInventory(
          ctx,
          fromWarehouse,
          materialId,
          -quantity,
          userId
        );
        await updateWarehouseInventory(ctx, toWarehouse, materialId, quantity, userId);
      } else if (actionType === "added") {
        if (!toWarehouse) {
          throw new ConvexError("toWarehouse is required for additions");
        }
        await updateWarehouseInventory(ctx, toWarehouse, materialId, quantity, userId);
      } else if (actionType === "removed") {
        if (!fromWarehouse) {
          throw new ConvexError("fromWarehouse is required for removals");
        }
        await updateWarehouseInventory(
          ctx,
          fromWarehouse,
          materialId,
          -quantity,
          userId
        );
      }
    }

    // Create the transaction embedding
    await createTransactionEmbedding(
      ctx,
      userId,
      transactionId,
      actionType,
      fromWarehouse,
      toWarehouse,
      args.description
    );

    return transactionId;
  },
});

async function createTransactionEmbedding(
  ctx: MutationCtx,
  userId: string,
  transactionId: Id<"transactions">,
  actionType: string,
  fromWarehouse: Id<"warehouses"> | undefined,
  toWarehouse: Id<"warehouses"> | undefined,
  description: string | undefined
) {
  let fromWarehouseName = "N/A";
  let toWarehouseName = "N/A";

  if (fromWarehouse) {
    const fromWarehouseDoc = await ctx.db.get(fromWarehouse);
    fromWarehouseName = fromWarehouseDoc?.name || "Unknown";
  }

  if (toWarehouse) {
    const toWarehouseDoc = await ctx.db.get(toWarehouse);
    toWarehouseName = toWarehouseDoc?.name || "Unknown";
  }

  // Fetch transaction details
  const transactionDetails = await ctx.db
    .query("transactions_details")
    .filter((q) => q.eq(q.field("transaction"), transactionId))
    .collect();

  // Fetch material names
  const materialNames = await Promise.all(
    transactionDetails.map(async (detail) => {
      const material = await ctx.db.get(detail.materialId);
      return `${material?.name || "Unknown"} (${detail.quantity})`;
    })
  );

  const transactionText = `
    ${actionType} - ${description || ""}
    From: ${fromWarehouseName}
    To: ${toWarehouseName}
    Materials: ${materialNames.join(", ")}
  `;

  await ctx.scheduler.runAfter(0, internal.embeddings.createEmbedding, {
    userId,
    sourceId: transactionId,
    sourceType: "transaction",
    text: transactionText,
  });
}

async function updateWarehouseInventory(
  ctx: MutationCtx,
  warehouseId: Id<"warehouses">,
  materialId: Id<"materials">,
  quantityChange: number,
  userId: string // Add userId parameter
) {
  const existingInventory = await ctx.db
    .query("inventories")
    .withIndex("by_warehouse_and_material", (q) =>
      q.eq("warehouseId", warehouseId).eq("materialId", materialId)
    )
    .filter((q) => q.eq(q.field("userId"), userId)) // Add this line
    .unique();

  if (existingInventory) {
    const newQuantity = existingInventory.quantity + quantityChange;
    if (newQuantity < 0) {
      throw new ConvexError(
        `Insufficient inventory for material ${materialId} in warehouse ${warehouseId}`
      );
    }
    await ctx.db.patch(existingInventory._id, { quantity: newQuantity });
  } else {
    if (quantityChange < 0) {
      throw new ConvexError(
        `No existing inventory for material ${materialId} in warehouse ${warehouseId}`
      );
    }
    await ctx.db.insert("inventories", {
      warehouseId: warehouseId,
      materialId: materialId,
      quantity: quantityChange,
      userId: userId, // Add this line
    });
  }
}

export const getInventoryByWarehouseId = query({
  args: { warehouseId: v.id("warehouses") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    const inventories = await ctx.db
      .query("inventories")
      .withIndex("by_warehouse", (q) => q.eq("warehouseId", args.warehouseId))
      .filter((q) => q.eq(q.field("userId"), userId)) // Add this line
      .collect();

    const inventoriesWithMaterialDetails = await Promise.all(
      inventories.map(async (inventory) => {
        const material = await ctx.db.get(inventory.materialId);

        if (!material) {
          return null;
        }

        return {
          ...inventory,
          material: {
            _id: material._id,
            name: material.name,
            type: material.type,
            imageFileId: material.imageFileId,
          },
        };
      })
    );

    return inventoriesWithMaterialDetails;
  },
});

// Define the type for a single inventory item
type InventoryItem = {
  materialId: Id<"materials">;
  materialName: string;
  quantity: number;
  warehouseId: Id<"warehouses">;
  imageUrl: string | null;
  materialType: string | undefined;
};

export const getInventoryForDisplayByWarehouseId = query({
  args: { warehouseId: v.id("warehouses") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    const inventories = await ctx.db
      .query("inventories")
      .withIndex("by_warehouse", (q) => q.eq("warehouseId", args.warehouseId))
      .filter((q) => q.eq(q.field("userId"), userId)) // Add this line
      .collect();

    const inventoriesForDisplay: (InventoryItem | null)[] = await Promise.all(
      inventories.map(async (inventory) => {
        const material = await ctx.db.get(inventory.materialId);

        if (!material) {
          return null; // Return null if material doesn't exist
        }

        // Construct the image URL if imageFileId exists
        const imageUrl = material.imageFileId
          ? await ctx.storage.getUrl(material.imageFileId)
          : null;

        return {
          materialId: inventory.materialId,
          materialName: material.name,
          quantity: inventory.quantity,
          warehouseId: inventory.warehouseId,
          imageUrl: imageUrl,
          materialType: material.type ?? undefined,
        };
      })
    );

    return inventoriesForDisplay;
  },
});
