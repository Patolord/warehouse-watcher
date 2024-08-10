"use client";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { ArrowBigLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import MaterialCard from "./_components/InventoryCard";
import { AddMaterialButton } from "./_components/buttons/add-button";
import { DataTable } from "./_components/tables/data-table";
import { columns } from "./_components/tables/inventoryTable/columns";
import { MovDataTable } from "./_components/tables/movTable/mov-data-table";
import { columns as movementsColumns } from "./_components/tables/movTable/movements-columns";
import { Cart } from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function WarehousePage({
  params,
}: {
  params: { warehouseId: Id<"warehouses"> };
}) {
  //Convex Queries
  const materials = useQuery(api.inventories.getInventoryByWarehouseId, {
    warehouseId: params.warehouseId,
  });

  const warehouse = useQuery(api.warehouses.getWarehouseById, {
    warehouseId: params.warehouseId,
  });

  const warehouses = useQuery(api.warehouses.getWarehouses);

  const movements = useQuery(
    api.material_movements.getMaterialMovementsByWarehouseId,
    { warehouseId: params.warehouseId },
  );
  const isTablet = useMediaQuery("(min-width: 640px)");
  const [selectedType, setSelectedType] = useState("");

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value);
  };

  //get material details from movements

  if (!materials || !warehouse || !movements || !warehouses) {
    return (
      <main className="flex flex-1 py-4 h-screen sm:h-fit flex-col space-y-2px-4">
        <div>Carregando...</div>
      </main>
    );
  }

  const materialTypes = materials?.map((material) => material!.materialType);
  const uniqueMaterialTypes = materialTypes?.filter(
    (type, index, array) => array.indexOf(type) === index,
  );

  const filteredMaterials = materials.filter((material) =>
    selectedType ? material!.materialType === selectedType : true,
  );

  if (isTablet) {
    return (
      <main className="flex flex-1 py-4 h-screen sm:h-fit flex-col space-y-2 px-4 relative">
        <div className="flex items-center relative z-10">
          <Button asChild variant="link">
            <Link href="/warehouses">
              <ArrowBigLeft size={20} strokeWidth={1.75} />
            </Link>
          </Button>
          <h3 className="text-xl">
            Materiais em &quot;{warehouse?.name}&quot;
          </h3>
        </div>
        <Image
          src="/logistics.svg"
          alt="Warehouse"
          width={350}
          height={350}
          className="rounded-lg absolute top-8 right-20 opacity-30 z-0 pointer-events-none"
        />

        <Tabs defaultValue="estoque">
          <TabsList>
            <TabsTrigger value="estoque">Estoque</TabsTrigger>
            <TabsTrigger value="movimentos">Movimentos</TabsTrigger>
          </TabsList>
          <TabsContent value="estoque">
            <h2 className="mt-10 flex gap-4">
              <AddMaterialButton warehouseId={params.warehouseId} />

              <Cart warehouseId={params.warehouseId} />
            </h2>

            <div>
              <DataTable columns={columns} data={materials} />
            </div>
          </TabsContent>
          <TabsContent value="movimentos">
            <h3 className="text-xl mb-3 mt-28">Movimentações</h3>

            <div>
              <MovDataTable columns={movementsColumns} data={movements} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    );
  }

  return (
    <main className="flex flex-1 py-4 h-screen sm:h-fit flex-col space-y-2 px-4 relative">
      <div className="flex items-center relative z-10">
        <Button asChild variant="link">
          <Link href="/warehouses">
            <ArrowBigLeft size={20} strokeWidth={1.75} />
          </Link>
        </Button>
        <h3 className="text-xl">Materiais em &quot;{warehouse?.name}&quot;</h3>
      </div>
      <Image
        src="/logistics.svg"
        alt="Warehouse"
        width={200}
        height={200}
        className="rounded-lg absolute top-8 right-8 opacity-30 z-0 pointer-events-none"
      />

      <Tabs defaultValue="estoque">
        <TabsList>
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="movimentos">Movimentos</TabsTrigger>
        </TabsList>
        <TabsContent value="estoque">
          <h2 className="mt-10 flex gap-4">
            <AddMaterialButton warehouseId={params.warehouseId} />

            <Cart warehouseId={params.warehouseId} />
          </h2>

          <div>
            {/* Mobile */}

            <div className="mt-10 mb-2">
              <label htmlFor="typeFilter">Filtrar: </label>
              <select
                id="typeFilter"
                onChange={handleTypeChange}
                value={selectedType}
              >
                {/* map options based on materialTypes */}
                {uniqueMaterialTypes &&
                  uniqueMaterialTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}

                {/* Add more options as needed */}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {filteredMaterials.map((material) => (
                <MaterialCard key={material!.materialId} material={material!} />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="movimentos">
          <h3 className="text-xl mb-3 mt-28">Movimentações</h3>

          <div>
            <MovDataTable columns={movementsColumns} data={movements} />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
