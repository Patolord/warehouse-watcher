import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { popup } from "leaflet";

export const createWarehouse = mutation({
  args: {
    name: v.string(),
    address: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const sucess = await ctx.db.insert("warehouses", {
      name: args.name,
      address: args.address,
    });
  },
});

export const getWarehouses = query({
  handler: async (ctx) => {
    const Warehouses = await ctx.db.query("warehouses").collect();

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
