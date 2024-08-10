"use client";

import { api } from "../../../../../../../../convex/_generated/api";
import { Doc, Id } from "../../../../../../../../convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { Package, PackageOpen } from "lucide-react";

import { types } from "./mov-data-table-toolbar";
import Actions from "./movements-actions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { milisecondsToDate } from "@/lib/utils";

/* export const columns: ColumnDef<
  Doc<"proposals"> & { companyName: string | null }
>[] = [ */

//function that returns warehouse name based on warehouse id
function WarehouseName({ warehouseId }: { warehouseId: Id<"warehouses"> }) {
  const warehouse = useQuery(api.warehouses.getWarehouseById, {
    warehouseId: warehouseId,
  });

  if (!warehouse) {
    return <div>Loading...</div>;
  }
  return warehouse!.name;
}

export const columns: ColumnDef<
  Doc<"material_movements"> & {
    toWarehouseName: string | undefined;
    fromWarehouseName: string | undefined;
  }
>[] = [
  {
    accessorKey: "Romaneio",
    header: "Romaneio",
    cell: ({ row }) => {
      return <Actions movement={row.original} />;
    },
  },
  {
    accessorKey: "Data",
    header: "Data",
    cell: ({ row }) => {
      const formattedDate = milisecondsToDate(row.original._creationTime);

      return formattedDate;
    },
  },

  {
    accessorKey: "Tipo",
    header: "Tipo",
    cell: ({ row }) => {
      const status = types.find((status) => status.value === row.original.type);

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "De",
    header: "De",
    cell: ({ row }) => {
      if (!row.original.fromWarehouseId) {
        return <Package size={22} strokeWidth={1} color="#0011ff" />;
      }
      return <WarehouseName warehouseId={row.original.fromWarehouseId} />;
    },
  },
  {
    accessorKey: "Para",
    header: "Para",
    cell: ({ row }) => {
      if (!row.original.toWarehouseId) {
        return <PackageOpen color="#0011ff" strokeWidth={1} />;
      }
      return <WarehouseName warehouseId={row.original.toWarehouseId} />;
    },
  },
  {
    accessorKey: "Materiais",
    header: "Qtd.",
    cell: ({ row }) => {
      const quantities = row.original.materials.map((material) => ({
        id: material.materialId,
        quantity: material.quantity,
      }));
      return (
        <div className="flex flex-col items-center">
          {quantities.map(({ quantity, id }) => (
            <div className="font-medium" key={id}>
              {quantity}x
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "Nome",
    header: "Nome",
    cell: ({ row }) => {
      const names = row.original.materials.map((material) => ({
        name: material.materialName,
        id: material.materialId,
      }));
      return (
        <ScrollArea className="max-h-[200px] min-h-0 max-w-[500px] min-w-0  overflow-auto">
          <div className="flex flex-col w-max pb-2">
            {names.map(({ name, id }) => (
              <TooltipProvider key={id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="font-medium max-w-[180px]">{name}</div>
                  </TooltipTrigger>
                  <TooltipContent>{name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      );
    },
  },

  //if from is null, omit row

  {
    accessorKey: "Descrição",
    header: "Descrição",
    cell: ({ row }) => {
      return (
        <ScrollArea className="max-h-[200px] min-h-0 max-w-[500px] min-w-0  overflow-auto">
          {row.original.description}
        </ScrollArea>
      );
    },
  },
];
