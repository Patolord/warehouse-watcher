import { ConvexError, v } from "convex/values";

import { Doc, Id } from "./_generated/dataModel";
import { MutationCtx, action, mutation, query } from "./_generated/server";

export const queryTransactionById = query({
  args: { transactionId: v.id("transactions") },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    return transaction;
  },
});

export const queryTransactionDetailsByTransactionId = query({
  args: { transactionId: v.id("transactions") },
  handler: async (ctx, args) => {
    const transaction = await ctx.db.get(args.transactionId);
    if (!transaction) {
      throw new ConvexError("Transaction not found");
    }

    const transactionsDetails = await ctx.db
      .query("transactions_details")
      .filter((q) => q.eq(q.field("transaction"), args.transactionId))
      .collect();

    const enrichedDetails = await Promise.all(
      transactionsDetails.map(async (detail) => {
        const material = await ctx.db.get(detail.material);
        return {
          ...detail,
          materialName: material?.name,
          materialImageFileId: material?.imageFileId,
        };
      })
    );

    const completeTransaction = {
      ...transaction,
      details: enrichedDetails,
    };

    return completeTransaction;
  },
});

// Query all transactions containing the specified material
export const queryTransactionsContainingMaterial = query({
  args: { materialId: v.id("materials") },
  handler: async (ctx, args) => {
    // 1. Query transactionsDetails by material ID
    const transactionsDetails = await ctx.db
      .query("transactions_details")
      .filter((q) => q.eq(q.field("material"), args.materialId))
      .collect();

    // 2. For each transaction, get the from_location and to_location from the transactions table
    const transactions = await Promise.all(
      transactionsDetails.map(async (detail) => {
        const transaction = await ctx.db.get(detail.transaction);
        return {
          ...detail,
          from_location: transaction?.from_location,
          to_location: transaction?.to_location,
          action_type: transaction?.action_type,
        };
      })
    );

    // 3. Query all warehouses to get location names
    const locations = await ctx.db.query("warehouses").collect();
    const locationMap = Object.fromEntries(
      locations.map((loc) => [loc._id, loc.name])
    );

    // 4. Map the transaction details to include the location names
    const enrichedTransactions = transactions.map((transaction) => {
      const fromLocationName = transaction.from_location
        ? locationMap[transaction.from_location] || "Unknown Location"
        : "N/A";
      const toLocationName = transaction.to_location
        ? locationMap[transaction.to_location] || "Unknown Location"
        : "N/A";

      return {
        transaction_id: transaction.transaction,
        from_location_name: fromLocationName,
        to_location_name: toLocationName,
        quantity: transaction.quantity,
        action_type: transaction.action_type,
      };
    });

    return enrichedTransactions;
  },
});
