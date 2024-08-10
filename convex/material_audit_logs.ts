import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const auditMaterialNameChange = internalMutation({
  args: {
    materialId: v.id("materials"),
    oldName: v.string(),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const { materialId, oldName, newName } = args;

    // Log the change
    await ctx.db.insert("material_audit_logs", {
      materialId,
      oldName,
      newName,
    });
  },
});
