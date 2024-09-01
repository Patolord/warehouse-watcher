import { ConvexError, v } from "convex/values";
import { auth } from "./auth";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const createWarehouse = mutation({
  args: {
    name: v.string(),
    address: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const warehouseId = await ctx.db.insert("warehouses", {
      userId: userId,
      name: args.name,
      address: args.address,
      latitude: args.latitude,
      longitude: args.longitude,
    });

    // Create an activity for the warehouse creation using the provided message
    await ctx.scheduler.runAfter(0, internal.activities.createActivity, {
      actionType: "warehouseCreated",
      time: new Date().toISOString(),
      details: {

        warehouseName: args.name,

      },
    });

    const warehouseText = `${args.name}. Located at: ${args.address || ""}. Coordinates: ${args.latitude}, ${args.longitude}`;
    await ctx.scheduler.runAfter(0, internal.embeddings.createEmbedding, {
      userId,
      sourceId: warehouseId,
      sourceType: "warehouse",
      text: warehouseText,
    });

    return warehouseId;
  },
});

export const getWarehouses = query({
  handler: async (ctx) => {
    const Warehouses = await ctx.db.query("warehouses").collect();

    return Warehouses;
  },
});

export const getWarehousesByUser = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new ConvexError("Not authenticated");
    }

    const Warehouses = await ctx.db
      .query("warehouses")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    return Warehouses;
  },
});

export const getWarehouseById = query({
  args: { warehouseId: v.optional(v.id("warehouses")) },
  handler: async (ctx, args) => {
    if (args.warehouseId === undefined) {
      return null;
    }
    const Warehouse = await ctx.db.get(args.warehouseId);

    return Warehouse;
  },
});

export const countWarehousesTable = query({
  handler: async (ctx) => {
    const Warehouses = await ctx.db.query("warehouses").collect();
    return Warehouses.length;
  },
});

export const deleteWarehouseById = mutation({
  args: { warehouseId: v.id("warehouses") },
  async handler(ctx, args) {
    await ctx.db.delete(args.warehouseId);
  },
});
