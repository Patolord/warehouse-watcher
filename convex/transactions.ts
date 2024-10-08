import { ConvexError, v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { auth } from "./auth";
import { TransactionWithWarehouseInfo } from "./types";

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
        const material = await ctx.db.get(detail.materialId);
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
      .filter((q) => q.eq(q.field("materialId"), args.materialId))
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
          _id: transaction?._id,
          _creationTime: transaction?._creationTime,
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

type EnrichedTransaction = {
  _creationTime: number;
  _id: Id<"transactions">;
  from_location?: Id<"warehouses">;
  to_location?: Id<"warehouses">;
  action_type: string;
  materials: {
    materialId: Id<"materials">;
    materialVersionId: Id<"materialVersions">;
    quantity: number;
    materialName: string;
    materialType: string | undefined;
    materialImageFileId: Id<"_storage"> | undefined;
    versionNumber: number;
    versionCreationTime: number;
  }[];
  fromWarehouseId?: Id<"warehouses">;
  toWarehouseId?: Id<"warehouses">;
  description?: string;
};

export const getTransactionsForDisplayByWarehouseId = query({
  args: { warehouseId: v.id("warehouses") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    const transactions = await ctx.db
      .query("transactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("userId"), userId),
          q.or(
            q.eq(q.field("from_location"), args.warehouseId),
            q.eq(q.field("to_location"), args.warehouseId)
          )
        )
      )
      .collect();

    const enrichedTransactions: EnrichedTransaction[] = await Promise.all(
      transactions.map(async (transaction) => {
        const details = await ctx.db
          .query("transactions_details")
          .withIndex("by_transaction", (q) =>
            q.eq("transaction", transaction._id)
          )
          .collect();

        const materials = await Promise.all(
          details.map(async (detail) => {
            const material = await ctx.db.get(detail.materialId);
            const materialVersion = await ctx.db.get(detail.materialVersionId);

            if (!material || !materialVersion) {
              throw new Error(
                `Material or version not found for detail ${detail._id}`
              );
            }

            return {
              materialId: detail.materialId,
              materialVersionId: detail.materialVersionId,
              quantity: detail.quantity,
              materialName: materialVersion.name,
              materialType: materialVersion.type,
              materialImageFileId: material.imageFileId,
              versionNumber: materialVersion.versionNumber,
              versionCreationTime: materialVersion._creationTime,
            };
          })
        );

        return {
          _creationTime: transaction._creationTime,
          _id: transaction._id,
          from_location: transaction.from_location,
          to_location: transaction.to_location,
          action_type: transaction.action_type,
          materials,
          fromWarehouseId: transaction.from_location,
          toWarehouseId: transaction.to_location,
          description: transaction.description,
        };
      })
    );

    return enrichedTransactions;
  },
});

interface Transaction {
  from: string;
  to: string;
}

export const getAllTransactions = query({
  handler: async (ctx): Promise<Transaction[]> => {
    const transactions = await ctx.db.query("transactions").collect();
    return transactions.map((t) => ({
      from: t.from_location?.toString() ?? "",
      to: t.to_location?.toString() ?? "",
    }));
  },
});

export const getTransactionsWithLocations = query({
  args: {},
  handler: async (ctx): Promise<TransactionWithWarehouseInfo[]> => {
    const userId = await auth.getUserId(ctx);
    console.log("Current user ID:", userId);

    if (!userId) {
      console.log("User not authenticated");
      throw new Error("User not authenticated");
    }

    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    console.log("Number of transactions found:", transactions.length);

    if (transactions.length === 0) {
      console.log("No transactions found for user:", userId);
    }

    const transactionsWithLocations = await Promise.all(
      transactions.map(
        async (transaction): Promise<TransactionWithWarehouseInfo> => {
          const fromWarehouse = transaction.from_location
            ? await ctx.db.get(transaction.from_location)
            : null;
          const toWarehouse = transaction.to_location
            ? await ctx.db.get(transaction.to_location)
            : null;
          return {
            ...transaction,
            from_warehouse: fromWarehouse,
            to_warehouse: toWarehouse,
          };
        }
      )
    );

    console.log("Transactions with locations:", transactionsWithLocations);

    return transactionsWithLocations;
  },
});

export const getUserTransactionsWithLocations = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      console.log("No user ID found");
      return [];
    }

    console.log("Fetching transactions for user:", userId);

    const transactions = await ctx.db
      .query("transactions")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    console.log("Number of transactions found:", transactions.length);

    const transactionsWithLocations = await Promise.all(
      transactions.map(async (transaction) => {
        const fromWarehouse = transaction.from_location
          ? await ctx.db.get(transaction.from_location)
          : null;
        const toWarehouse = transaction.to_location
          ? await ctx.db.get(transaction.to_location)
          : null;
        return {
          ...transaction,
          from_warehouse: fromWarehouse,
          to_warehouse: toWarehouse,
        };
      })
    );

    console.log("Transactions with locations:", transactionsWithLocations);

    return transactionsWithLocations;
  },
});

export const debugAllTransactions = query({
  handler: async (ctx) => {
    const allTransactions = await ctx.db.query("transactions").collect();
    console.log("All transactions:", allTransactions);
    return allTransactions;
  },
});