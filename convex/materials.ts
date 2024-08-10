import { ConvexError, v } from "convex/values";

import { action, mutation, query } from "./_generated/server";
import { api } from "./_generated/api";
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
    /*   const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }
 */
    const existing = await ctx.db
      .query("materials")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (existing) {
      throw new ConvexError("Material já existe");
    }

    const sucess = await ctx.db.insert("materials", {
      name: args.name,
      type: args.type,
      imageFileId: args.imageFileId,
      additionalAttributes: args.additionalAttributes,
    });
  },
});

export const updateMaterialbyId = mutation({
  args: {
    materialId: v.id("materials"),
    name: v.string(),
    type: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const currentMaterial = await ctx.db
      .query("materials")
      .withIndex("by_id", (q) => q.eq("_id", args.materialId))
      .unique();

    if (!currentMaterial) {
      throw new ConvexError("No active material found for the given ID");
    }

    const now = Date.now();

    await ctx.db.patch(args.materialId, {
      name: args.name,
      type: args.type,
      imageFileId: currentMaterial.imageFileId,
    });
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
