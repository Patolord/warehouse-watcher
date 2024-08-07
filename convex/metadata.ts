import { MutationCtx } from "./_generated/server";
import { query } from "./_generated/server";

export type CountField =
    | "materialCount"
    | "warehouseCount"
    | "supplierCount"
    | "pricesCount";

export type Operation = "increment" | "decrement";

export async function UpdateCount(
    ctx: MutationCtx,
    countField: CountField,
    operation: Operation,
) {
    // Obter o valor atual de countField
    const metadata = await ctx.db.query("metadata").first();

    const currentCount: number = metadata![countField];

    if (operation === "increment") {
        await ctx.db.patch(metadata!._id, {
            [countField]: currentCount + 1,
        });
    } else if (operation === "decrement") {
        await ctx.db.patch(metadata!._id, {
            [countField]: currentCount - 1,
        });
    }
}

export const getMetadata = query({
    handler: async (ctx) => {
        const metadata = await ctx.db.query("metadata").first();

        const countStrings = [
            metadata!.materialCount.toString(),
            metadata!.warehouseCount.toString(),
            metadata!.supplierCount.toString(),
            metadata!.pricesCount.toString(),
        ];
        return countStrings;
    },
});