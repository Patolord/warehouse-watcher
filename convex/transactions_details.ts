import { v } from "convex/values";
import { query } from "./_generated/server";

//query transaction rows by id

export const queryTransactionById = query({
  args: { transactionId: v.id("transactions") },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    return transaction;
  },
});

// Query all transactions_details by transaction id with material details
export const queryTransactionsDetailsByTransactionId = query({
  args: { transactionId: v.id("transactions") },
  handler: async (ctx, args) => {
    // Query transactions_details by transactionId
    const transactionsDetails = await ctx.db
      .query("transactions_details")
      .filter((q) => q.eq(q.field("transaction"), args.transactionId))
      .collect();

    // Retrieve material details for each transactionsDetails entry
    const enrichedDetails = await Promise.all(
      transactionsDetails.map(async (detail) => {
        const material = await ctx.db.get(detail.material);
        return {
          ...detail,
          materialName: material!.name,
          materialImageFileId: material?.imageFileId,
        };
      })
    );

    return enrichedDetails;
  },
});
