import { v } from "convex/values";
import { query } from "./_generated/server";

export const getMaterialVersionsByMaterialId = query({
  args: { materialId: v.id("materials") },
  handler: async (ctx, args) => {
    const materialVersions = await ctx.db
      .query("materialVersions")
      .filter((q) => q.eq(q.field("materialId"), args.materialId))
      .collect();

    return materialVersions;
  },
});
