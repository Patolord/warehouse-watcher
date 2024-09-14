"use client";

import { useQuery } from "convex/react";
import { ArrowBigLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MapPin } from "lucide-react"; // Add this import

import MaterialCard from "./_components/InventoryCard";
import { AddMaterialButton } from "./_components/buttons/add-button";
import { DataTable } from "./_components/tables/data-table";
import { columns } from "./_components/tables/inventoryTable/columns";
import { MovDataTable } from "./_components/tables/movTable/mov-data-table";
import { columns as transactionsColumns } from "./_components/tables/movTable/movements-columns";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";

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

export default function WarehousePage({
  params,
}: {
  params: { warehouseId: Id<"warehouses"> };
}) {
  //Convex Queries

  const currentWarehouse = useQuery(api.warehouses.getWarehouseById, {
    warehouseId: params.warehouseId,
  });

  const uniqueMaterialTypes = useQuery(
    api.materials.getUniqueMaterialTypesByUser,
    {}
  );

  //query inventory information

  //query inventory information
  const inventory = useQuery(
    api.inventories.getInventoryForDisplayByWarehouseId,
    {
      warehouseId: params.warehouseId,
    }
  );

  const transactions = useQuery(
    api.transactions.getTransactionsForDisplayByWarehouseId,
    {
      warehouseId: params.warehouseId,
    }
  );

  if (!inventory) {
    <div>Loading...</div>;
  }

  if (!transactions) {
    <div>Loading...</div>;
  }

  const isTablet = useMediaQuery("(min-width: 640px)");
  const [selectedType, setSelectedType] = useState("all");

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  // Filter materials based on selected type
  const filteredMaterials = inventory
    ? inventory.filter((material) =>
        selectedType === "all" ? true : material?.materialType === selectedType
      )
    : [];

  const mapLink = currentWarehouse
    ? `/dashboard/worldmap?warehouseId=${params.warehouseId}&lat=${currentWarehouse.latitude}&lng=${currentWarehouse.longitude}`
    : `/dashboard/worldmap?warehouseId=${params.warehouseId}`;

  if (isTablet) {
    return (
      <main className="flex flex-1 py-4 h-screen sm:h-fit flex-col space-y-2 px-4 relative">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center">
            <Button asChild variant="link">
              <Link href="/dashboard/warehouses">
                <ArrowBigLeft size={20} strokeWidth={1.75} />
              </Link>
            </Button>
            <h3 className="text-xl">
              Materials in &quot;{currentWarehouse?.name}&quot;
            </h3>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={mapLink}>
              <MapPin size={16} className="mr-2" />
              View on map
            </Link>
          </Button>
        </div>
        <Image
          src="/logistics.svg"
          alt="Warehouse"
          width={350}
          height={350}
          className="rounded-lg absolute top-8 right-20 opacity-30 z-0 pointer-events-none"
        />

        <Tabs defaultValue="inventory">
          <TabsList>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="movements">Movements</TabsTrigger>
          </TabsList>
          <TabsContent value="inventory">
            <h2 className="mt-10 flex gap-4">
              <AddMaterialButton warehouseId={params.warehouseId} />

              <Cart warehouseId={params.warehouseId} />
            </h2>

            <div>
              {inventory && inventory.length > 0 ? (
                <DataTable columns={columns} data={inventory} />
              ) : (
                <div>No materials registered.</div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="movements">
            <h3 className="text-xl mb-3 mt-28">Movements</h3>

            <div>
              <MovDataTable
                columns={transactionsColumns}
                data={transactions ?? []}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    );
  }

  return (
    <main className="flex flex-1 py-4 h-screen sm:h-fit flex-col space-y-2 px-4 relative">
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center">
          <Button asChild variant="link">
            <Link href="/dashboard/warehouses">
              <ArrowBigLeft size={20} strokeWidth={1.75} />
            </Link>
          </Button>
          <h3 className="text-xl">
            Materials in &quot;{currentWarehouse?.name}&quot;
          </h3>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={mapLink}>
            <MapPin size={16} className="mr-2" />
            View on map
          </Link>
        </Button>
      </div>
      <Image
        src="/logistics.svg"
        alt="Warehouse"
        width={200}
        height={200}
        className="hidden sm:block rounded-lg absolute top-8 right-8 opacity-30 z-0 pointer-events-none"
      />

      <Tabs defaultValue="inventory">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movements">Movements</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <h2 className="mt-10 flex gap-4">
            <AddMaterialButton warehouseId={params.warehouseId} />

            <Cart warehouseId={params.warehouseId} />
          </h2>

          <div>
            {/* Mobile */}

            <div className="mt-10 mb-2">
              <label htmlFor="typeFilter">Filter: </label>
              <select
                id="typeFilter"
                onChange={handleTypeChange}
                value={selectedType}
              >
                <option value="all">All Types</option>
                {uniqueMaterialTypes &&
                  uniqueMaterialTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {filteredMaterials.map((material) => (
                <MaterialCard key={material!.materialId} material={material!} />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="movements">
          <h3 className="text-xl mb-3 mt-28">Movements</h3>

          <div>
            <MovDataTable
              columns={transactionsColumns}
              data={transactions ?? []}
            />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
