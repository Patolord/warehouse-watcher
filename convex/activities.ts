import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";

export const createActivity = internalMutation({
    args: {
        actionType: v.string(),
        time: v.string(),
        details: v.any(),
    },
    async handler(ctx, args) {

        await ctx.db.insert("activities", {
            actionType: args.actionType,
            time: args.time,
            details: args.details,
        });
    },
});



export const getRecentActivities = query({
    handler: async (ctx) => {
        const recentActivities = await ctx.db.query("activities").order("desc").take(10)
        return recentActivities.map(activity => ({
            id: activity._id,
            actionType: activity.actionType,
            time: activity.time,
            details: activity.details,
        }));
    },
});

