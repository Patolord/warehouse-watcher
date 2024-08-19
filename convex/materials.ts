import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";

import { queryTransactionsContainingMaterial } from "./transactions";

//queries
export const getMaterials = query({
  handler: async (ctx) => {
    const materials = await ctx.db.query("materials").collect();
    const AlphabeticalMaterials = materials.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return AlphabeticalMaterials;
  },
});

export const getMaterialsWithImage = query({
  handler: async (ctx) => {
    let currentMaterials = await ctx.db.query("materials").collect();

    const currentMaterialsWithUrl = await Promise.all(
      currentMaterials.map(async (material) => ({
        ...material,
        url: material.imageFileId
          ? await ctx.storage.getUrl(material.imageFileId)
          : null,
      }))
    );

    const AlphabeticalMaterials = currentMaterialsWithUrl.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return AlphabeticalMaterials;
  },
});

export const getMaterialsWithImageByUser = query({
  args: { userId: v.string() },

  handler: async (ctx, args) => {
    let currentMaterials = await ctx.db
      .query("materials")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    const currentMaterialsWithUrl = await Promise.all(
      currentMaterials.map(async (material) => ({
        ...material,
        url: material.imageFileId
          ? await ctx.storage.getUrl(material.imageFileId)
          : null,
      }))
    );

    const AlphabeticalMaterials = currentMaterialsWithUrl.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return AlphabeticalMaterials;
  },
});

export const getUniqueMaterialTypes = query({
  handler: async (ctx) => {
    const materials = await ctx.db
      .query("materials")
      .withIndex("by_type")
      .collect();

    const uniqueTypes = new Set(materials.map((material) => material.type));
    const formattedTypes = Array.from(uniqueTypes).map((type) => ({
      label: type!,
      value: type!,
    }));

    return formattedTypes!;
  },
});

export const getMaterialWithImageById = query({
  args: { materialId: v.id("materials") },
  handler: async (ctx, args) => {
    const material = await ctx.db.get(args.materialId);

    if (!material) {
      throw new ConvexError("Material not found");
    }

    const url = material.imageFileId
      ? await ctx.storage.getUrl(material.imageFileId)
      : null;

    return { ...material, url };
  },
});

//mutations

export const createMaterial = mutation({
  args: {
    name: v.string(),
    type: v.optional(v.string()),
    imageFileId: v.optional(v.id("_storage")),
    additionalAttributes: v.optional(v.any()),
  },
  async handler(ctx, args) {
    // Uncomment the following block if you want to re-enable authentication
    /*
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("User not authenticated");
    }
    */

    const { name, type, imageFileId, additionalAttributes } = args;

    // Check for existing material with the same name
    const existing = await ctx.db
      .query("materials")
      .withIndex("by_name", (q) => q.eq("name", name))
      .unique();

    if (existing) {
      throw new ConvexError("Material já existe");
    }

    // Create the main material record
    const materialId = await ctx.db.insert("materials", {
      userId: "user1", // Uncomment if user authentication is implemented
      name,
      type,
      imageFileId,
      additionalAttributes,
    });

    // Create the initial version of the material
    const versionId = await ctx.db.insert("materialVersions", {
      materialId,
      name,
      type,
      versionNumber: 1,
    });

    // Update the material with the current version ID
    await ctx.db.patch(materialId, { currentVersionId: versionId });

    return { materialId, versionId };
  },
});

export const deleteMaterialById = mutation({
  args: {
    materialId: v.id("materials"),
  },
  async handler(ctx, args) {
    const hasTransaction = await queryTransactionsContainingMaterial(ctx, {
      materialId: args.materialId,
    });

    if (hasTransaction.length > 0) {
      throw new ConvexError(
        "Material cannot be deleted because it has movements"
      );
    }

    await ctx.db.delete(args.materialId);
  },
});

export const addImageToMaterial = mutation({
  args: {
    materialId: v.id("materials"),
    imageFileId: v.id("_storage"),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.materialId, {
      imageFileId: args.imageFileId,
    });
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const updateMaterialById = mutation({
  args: {
    materialId: v.id("materials"),
    name: v.string(),
    type: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const { materialId, name, type } = args;

    // Get the current material
    const currentMaterial = await ctx.db.get(materialId);

    if (!currentMaterial) {
      throw new ConvexError("No active material found for the given ID");
    }

    // Check if the new name already exists (if name is being changed)
    if (name !== currentMaterial.name) {
      const existingMaterial = await ctx.db
        .query("materials")
        .withIndex("by_name", (q) => q.eq("name", name))
        .unique();

      if (existingMaterial && existingMaterial._id !== materialId) {
        throw new ConvexError("A material with this name already exists");
      }
    }

    // Get the user ID from the auth context (uncomment if needed)
    /*
    const userId = ctx.auth.userId;
    if (!userId) {
      throw new ConvexError("User must be authenticated to update materials");
    }
    */

    // Check if there are any changes
    const hasNameChange = name !== currentMaterial.name;
    const hasTypeChange = type !== currentMaterial.type;

    if (hasNameChange || hasTypeChange) {
      // Get the latest version
      const latestVersion = await ctx.db
        .query("materialVersions")
        .withIndex("by_material", (q) => q.eq("materialId", materialId))
        .order("desc")
        .first();

      const newVersionNumber = (latestVersion?.versionNumber ?? 0) + 1;

      // Create a new version
      const newVersionId = await ctx.db.insert("materialVersions", {
        materialId,
        name,
        type,
        versionNumber: newVersionNumber,
      });

      // Update the material record
      await ctx.db.patch(materialId, {
        name,
        type,
        currentVersionId: newVersionId,
      });

      // Log the change if the name was updated
      if (hasNameChange) {
        await ctx.db.insert("material_audit_logs", {
          materialId,
          oldName: currentMaterial.name,
          newName: name,
          // userId, // Uncomment if user authentication is implemented
        });
      }

      return {
        success: true,
        updatedMaterial: await ctx.db.get(materialId),
        newVersionId,
      };
    }

    // If no changes, return the current material
    return {
      success: false,
      updatedMaterial: currentMaterial,
      message: "No changes were made.",
    };
  },
});
