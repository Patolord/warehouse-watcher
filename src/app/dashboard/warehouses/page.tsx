"use client";

import { useQuery } from "convex/react";
import { useEffect } from "react";
import { columns } from "./_components/columns";
import { CreateButton } from "./_components/create-button";
import { DataTable } from "./_components/data-table";
import WarehouseCard from "./_components/warehouse-card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { api } from "../../../../convex/_generated/api";
import { useWarehousesStore } from "@/store/warehousesStore";
import { Button } from "@/components/ui/button";

export default function WarehousesPage() {
  const { warehouses, setWarehouses, isLoading, setIsLoading } =
    useWarehousesStore();
  const queryResult = useQuery(api.warehouses.getWarehousesByUser);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (queryResult) {
      setWarehouses(queryResult);
      setIsLoading(false);
    }
  }, [queryResult, setWarehouses, setIsLoading]);

  return (
    <>
      <div className="flex items-center justify-between mx-10 mb-4">
        <h1 className="text-lg font-semibold md:text-2xl">Warehouses</h1>

        <CreateButton
          triggerButton={
            <Button className="bg-blue-700 hover:bg-blue-500">
              Add Warehouse
            </Button>
          }
        />
      </div>
      {isDesktop ? (
        <div className="container mx-auto ">
          <DataTable columns={columns} data={warehouses ?? []} />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {warehouses?.map((warehouse) => (
            <WarehouseCard key={warehouse._id} warehouse={warehouse} />
          ))}
        </div>
      )}
    </>
  );
}
