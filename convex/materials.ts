import { ConvexError, v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { UpdateCount } from "./metadata";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const createMaterial = mutation({
    args: {
        name: v.string(),
        type: v.optional(v.string()),
        imageFileId: v.optional(v.id("_storage")),
        additionalAttributes: v.optional(v.any()),
        nickname: v.optional(v.string()),
        baseUnit: v.optional(v.string()),

        endDate: v.optional(v.number()),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("User not authenticated");
        }

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
            nickname: args.nickname,
            baseUnit: args.baseUnit || "un", // Default to "un" if not specified

            endDate: args.endDate,
            isCurrent: true,
        });

        // Obter o valor atual de materialCount
        if (sucess) {
            await UpdateCount(ctx, "materialCount", "increment");
        }
    },
});

export const getMaterials = query({
    handler: async (ctx) => {
        const materials = await ctx.db.query("materials").collect();
        const AlphabeticalMaterials = materials.sort((a, b) =>
            a.name.localeCompare(b.name),
        );

        return AlphabeticalMaterials;
    },
});

export const getCurrentMaterials = query({
    handler: async (ctx) => {
        const currentMaterials = await ctx.db
            .query("materials")
            .filter((q) => q.eq(q.field("isCurrent"), true))
            .collect();

        return currentMaterials;
    },
});

export const getCurrentMaterialsWithImage = query({
    handler: async (ctx) => {
        let currentMaterials = await ctx.db
            .query("materials")
            .filter((q) => q.eq(q.field("isCurrent"), true))
            .collect();

        const currentMaterialsWithUrl = await Promise.all(
            currentMaterials.map(async (material) => ({
                ...material,
                url: material.imageFileId
                    ? await ctx.storage.getUrl(material.imageFileId)
                    : null,
            })),
        );

        const AlphabeticalMaterials = currentMaterialsWithUrl.sort((a, b) =>
            a.name.localeCompare(b.name),
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

        return Array.from(uniqueTypes);
    },
});

export const getUniqueMaterialTypes2 = query({
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

export const updateMaterialbyId = mutation({
    args: {
        materialId: v.id("materials"),
        name: v.string(),
        type: v.optional(v.string()),
        baseUnit: v.optional(v.string()),
        nickname: v.optional(v.string()),
        additionalAttributes: v.optional(v.any()),
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
        const gracePeriod = 24 * 60 * 60 * 1000 * 70; // 7 days in milliseconds
        const withinGracePeriod = now - currentMaterial._creationTime < gracePeriod;

        if (withinGracePeriod) {
            // Update the current record directly if within the grace period
            await ctx.db.patch(currentMaterial._id, {
                name: args.name,
                type: args.type,
            });
        } else {
            // Mark the current material as historical
            await ctx.db.patch(args.materialId, {
                isCurrent: false,
                endDate: Date.now(), // Set the end date to now
            });

            // Insert a new record as the current version
            await ctx.db.insert("materials", {
                name: args.name,
                type: args.type,
                baseUnit: args.baseUnit,
                nickname: args.nickname,
                additionalAttributes: args.additionalAttributes,
                rootMaterialId: args.materialId,
                imageFileId: currentMaterial.imageFileId,
                endDate: undefined, // No end date for the new current record
                isCurrent: true, // Mark as current
            });
        }
    },
});

export const checkMaterialMovement = query({
    args: {
        materialId: v.id("materials"),
    },
    handler: async (ctx, args) => {
        const movements = await ctx.db.query("material_movements").collect();

        const existingMovement = movements.some((movement) =>
            movement.materials.some(
                (material) => material.materialId === args.materialId,
            ),
        );

        return existingMovement;
    },
});

export const deleteMaterialById = mutation({
    args: {
        materialId: v.id("materials"),
    },
    async handler(ctx, args) {
        const movements = await ctx.db.query("material_movements").collect();

        const existingMovement = movements.some((movement) =>
            movement.materials.some(
                (material) => material.materialId === args.materialId,
            ),
        );

        if (existingMovement) {
            throw new ConvexError(
                "Material cannot be deleted because it has movements",
            );
        } else {
            await ctx.db.delete(args.materialId);
            await UpdateCount(ctx, "materialCount", "decrement");
        }
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

export const countMaterialsTable = query({
    handler: async (ctx) => {
        const materials = await ctx.db.query("materials").collect();
        const count = materials.length.toString();
        return count;
    },
});