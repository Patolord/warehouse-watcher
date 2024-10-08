"use client";

import { api } from "../../../../../../../../convex/_generated/api";
import { Id } from "../../../../../../../../convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "convex/react";
import { Package, PackageOpen } from "lucide-react";

import Actions from "./movements-actions";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { milisecondsToDate } from "@/lib/utils";

function WarehouseName({ warehouseId }: { warehouseId: Id<"warehouses"> }) {
  const warehouse = useQuery(api.warehouses.getWarehouseById, {
    warehouseId: warehouseId,
  });

  if (!warehouse) {
    return <div>Loading...</div>;
  }
  return warehouse!.name;
}

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

export const columns: ColumnDef<EnrichedTransaction | null>[] = [
  {
    accessorKey: "Document",
    header: "Document",
    cell: ({ row }) => {
      return <Actions movement={row.original} />;
    },
  },
  {
    accessorKey: "Date",
    header: "Date",
    cell: ({ row }) => {
      const formattedDate = milisecondsToDate(row.original!._creationTime);

      return formattedDate;
    },
  },

  {
    accessorKey: "action_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original?.action_type;
      const displayType =
        type === "added"
          ? "Added"
          : type === "removed"
            ? "Removed"
            : type === "transfered"
              ? "Transfered"
              : type;

      return (
        <div className="flex w-[100px] items-center">
          <span>{displayType}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const type = row.getValue(id);
      if (typeof type !== "string") return false;
      return value.includes(type.toLowerCase());
    },
  },

  {
    accessorKey: "From",
    header: "From",
    cell: ({ row }) => {
      if (!row.original!.fromWarehouseId) {
        return <Package size={22} strokeWidth={1} color="#0011ff" />;
      }
      return <WarehouseName warehouseId={row.original!.fromWarehouseId} />;
    },
  },
  {
    accessorKey: "To",
    header: "To",
    cell: ({ row }) => {
      if (!row.original!.toWarehouseId) {
        return <PackageOpen color="#0011ff" strokeWidth={1} />;
      }
      return <WarehouseName warehouseId={row.original!.toWarehouseId} />;
    },
  },
  {
    accessorKey: "Materiais",
    header: "Qty.",
    cell: ({ row }) => {
      const quantities = row.original!.materials.map((material) => ({
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
    header: "Name",
    cell: ({ row }) => {
      const names = row.original!.materials.map((material) => ({
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

  {
    accessorKey: "Descrição",
    header: "Descrição",
    cell: ({ row }) => {
      return (
        <ScrollArea className="max-h-[200px] min-h-0 max-w-[500px] min-w-0  overflow-auto">
          {row.original?.description}
        </ScrollArea>
      );
    },
  },
];
