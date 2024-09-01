import { query } from "./_generated/server";
import { auth } from "./auth";

export const getStats = query({
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const materials = await ctx.db
            .query("materials")
            .filter((q) => q.eq(q.field("userId"), userId))
            .collect();

        const warehouses = await ctx.db
            .query("warehouses")
            .filter((q) => q.eq(q.field("userId"), userId))
            .collect();

        const transactions = await ctx.db
            .query("transactions")
            .filter((q) => q.eq(q.field("userId"), userId))
            .collect();

        const users = await ctx.db.query("users").collect();

        return {
            totalMaterials: materials.length,
            totalWarehouses: warehouses.length,
            totalTransactions: transactions.length,
            totalUsers: users.length,
        };
    },
});

export const getInventoryTrends = query({
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        // This is a placeholder. In a real application, you'd aggregate data over time.
        // For now, we'll return mock data.
        return [
            { date: "2023-01", count: 100 },
            { date: "2023-02", count: 120 },
            { date: "2023-03", count: 130 },
            { date: "2023-04", count: 125 },
            { date: "2023-05", count: 140 },
        ];
    },
});

export const getStockLevels = query({
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const inventories = await ctx.db
            .query("inventories")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .collect();

        const stockLevelsMap = new Map<string, { id: string, name: string, quantity: number }>();

        await Promise.all(
            inventories.map(async (inventory) => {
                const material = await ctx.db.get(inventory.materialId);
                if (material && material.userId === userId) {
                    const name = material.name || "Unknown";

                    if (stockLevelsMap.has(name)) {
                        const existingStock = stockLevelsMap.get(name)!;
                        existingStock.quantity += inventory.quantity;
                    } else {
                        stockLevelsMap.set(name, {
                            id: inventory._id,
                            name,
                            quantity: inventory.quantity,
                        });
                    }
                }
            })
        );

        return Array.from(stockLevelsMap.values());
    },
});

export const getCategoryDistribution = query({
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            throw new Error("Not authenticated");
        }

        const materials = await ctx.db
            .query("materials")
            .filter((q) => q.eq(q.field("userId"), userId))
            .collect();

        const categoryCount: { [key: string]: number } = {};
        materials.forEach((material) => {
            const category = material.type || "Uncategorized";
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });

        return Object.entries(categoryCount).map(([name, value]) => ({
            name,
            value,
        }));
    },
});