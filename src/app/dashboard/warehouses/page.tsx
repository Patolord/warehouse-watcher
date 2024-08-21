"use client";

import { api } from "../../../../convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";

import { columns } from "./_components/columns";
import { CreateButton } from "./_components/create-button";
import { DataTable } from "./_components/data-table";
import WarehouseCard from "./_components/warehouse-card";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function WarehousesPage() {

  const warehouses = useQuery(api.warehouses.getWarehousesByUser);
  const isDesktop = useMediaQuery("(min-width: 768px)");



  const isLoading = warehouses === undefined;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-8 w-full items-center mt-12">
          <Loader2 className="h-32 w-32 animate-spin text-gray-700" />
          Carregando estoques...
        </div>
      );
    }

    if (warehouses && warehouses.length > 0) {
      return (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Estoques</h1>
            <CreateButton />
          </div>
          {isDesktop ? (
            <div className="container mx-auto ">
              <DataTable columns={columns} data={warehouses} />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {warehouses.map((warehouse) => (
                <WarehouseCard key={warehouse._id} warehouse={warehouse} />
              ))}
            </div>
          )}
        </>
      );
    }

    return (
      <div className="flex flex-col gap-8 w-full items-center mt-12">
        <div className="2xl">Sem estoques</div>
        <CreateButton />
      </div>
    );
  };

  return (
    <div className="flex flex-1 py-4 h-screen sm:h-fit flex-col space-y-2 px-4">
      {renderContent()}
    </div>
  );
}