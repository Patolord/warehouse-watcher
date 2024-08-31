import { query } from "./_generated/server";
import { auth } from "./auth";

export const viewer = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        return userId !== null ? ctx.db.get(userId) : null;
    },
});

export const getCurrentUserId = query({
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        console.log("Current user ID:", userId);
        return userId;
    },
});