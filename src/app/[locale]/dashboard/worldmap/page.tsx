"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import dynamic from "next/dynamic";
import { Warehouse, TransactionWithWarehouseInfo } from "./types";
import { api } from "../../../../../convex/_generated/api";
import WarehouseDetails from "./WarehouseDetails";
import TransactionDetails from "./TransactionDetails";

const DynamicWorldMap = dynamic(() => import("./Worldmap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const WarehousePage: React.FC = () => {
  const userWarehouses = useQuery(api.warehouses.getWarehousesByUser);
  const allWarehouses = useQuery(api.warehouses.getWarehouses);
  const transactions = useQuery(api.transactions.getTransactionsWithLocations);
  const allTransactions = useQuery(api.transactions.debugAllTransactions);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null
  );
  const [selectedTransactions, setSelectedTransactions] = useState<
    TransactionWithWarehouseInfo[] | null
  >(null);

  const handleWarehouseSelect = (warehouse: Warehouse | null) => {
    setSelectedWarehouse(warehouse);
    setSelectedTransactions(null);
  };

  const handleTransactionsSelect = (
    transactions: TransactionWithWarehouseInfo[] | null
  ) => {
    setSelectedTransactions(transactions);
    setSelectedWarehouse(null);
  };

  const isUserWarehouse = (warehouse: Warehouse) => {
    return userWarehouses?.some((uw) => uw._id === warehouse._id) ?? false;
  };

  const currentUserId = useQuery(api.users.getCurrentUserId);

  useEffect(() => {
    console.log("Current user ID:", currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    console.log("All transactions:", allTransactions);
    console.log("User transactions:", transactions);
  }, [allTransactions, transactions]);

  if (
    userWarehouses === undefined ||
    allWarehouses === undefined ||
    transactions === undefined
  ) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const otherWarehouses = allWarehouses.filter(
    (warehouse) =>
      !userWarehouses.some(
        (userWarehouse) => userWarehouse._id === warehouse._id
      )
  );

  return (
    <div className="h-full flex flex-col p-4 space-y-4">
      <h1 className="text-3xl font-bold">
        Warehouse Locations and Transactions
      </h1>
      <div className="flex-1 flex">
        <div className="flex-1 bg-white rounded-lg border shadow-lg overflow-hidden">
          <DynamicWorldMap
            userWarehouses={userWarehouses as Warehouse[]}
            otherWarehouses={otherWarehouses}
            transactions={transactions as TransactionWithWarehouseInfo[]}
            onWarehouseSelect={handleWarehouseSelect}
            onTransactionsSelect={handleTransactionsSelect}
          />
        </div>
        {selectedWarehouse && (
          <div className="w-1/3 ml-4">
            <WarehouseDetails
              warehouse={selectedWarehouse}
              onClose={() => setSelectedWarehouse(null)}
              isUserWarehouse={isUserWarehouse(selectedWarehouse)}
            />
          </div>
        )}
        {selectedTransactions && (
          <div className="w-1/3 ml-4">
            <TransactionDetails
              transactions={selectedTransactions}
              onClose={() => setSelectedTransactions(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehousePage;
