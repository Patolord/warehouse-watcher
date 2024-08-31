import React from "react";
import { TransactionWithWarehouseInfo } from "./types";

interface TransactionDetailsProps {
  transactions: TransactionWithWarehouseInfo[];
  onClose: () => void;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  transactions,
  onClose,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Transactions</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      <p className="mb-2">
        <strong>Total Transactions:</strong> {transactions.length}
      </p>
      <ul className="space-y-4">
        {transactions.map((transaction) => (
          <li key={transaction._id} className="border-b pb-2">
            <p>
              <strong>Type:</strong> {transaction.action_type}
            </p>
            <p>
              <strong>From:</strong> {transaction.from_warehouse?.name || "N/A"}
            </p>
            <p>
              <strong>To:</strong> {transaction.to_warehouse?.name || "N/A"}
            </p>
            {transaction.description && (
              <p>
                <strong>Description:</strong> {transaction.description}
              </p>
            )}
            <p>
              <strong>Date:</strong>{" "}
              {new Date(transaction._creationTime).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionDetails;
