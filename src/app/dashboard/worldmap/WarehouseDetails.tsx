import React from "react";
import Link from "next/link";
import { Warehouse } from "./types";

interface WarehouseDetailsProps {
  warehouse: Warehouse;
  onClose: () => void;
  isUserWarehouse: boolean;
}

const WarehouseDetails: React.FC<WarehouseDetailsProps> = ({
  warehouse,
  onClose,
  isUserWarehouse,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg h-full overflow-y-auto flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{warehouse.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          ×
        </button>
      </div>
      <div className="flex-grow">
        {warehouse.address && (
          <p className="mb-2">
            <strong>Address:</strong> {warehouse.address}
          </p>
        )}
        <p className="mb-2 text-xs text-gray-500">
          Coordinates: {warehouse.latitude}, {warehouse.longitude}
        </p>
        <p className="mb-2">
          <strong>Created:</strong>{" "}
          {new Date(warehouse._creationTime).toLocaleDateString()}
        </p>
        {/* Add more details as needed */}
      </div>
      {isUserWarehouse && (
        <div className="mt-4">
          <Link href={`/dashboard/warehouses/${warehouse._id}`} passHref>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              View Warehouse Details
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WarehouseDetails;
