import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createWarehouse = mutation({
  args: {
    name: v.string(),
    address: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const sucess = await ctx.db.insert("warehouses", {
      userId: "user1",
      name: args.name,
      address: args.address,
      latitude: args.latitude,
      longitude: args.longitude,
    });
  },
});

export const getWarehouses = query({
  handler: async (ctx) => {
    const Warehouses = await ctx.db.query("warehouses").collect();

    return Warehouses;
  },
});

export const getWarehousesByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const Warehouses = await ctx.db
      .query("warehouses")
      .filter((q) => q.eq(q.field("userId"), args.userId))
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
