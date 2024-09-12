"use client";

import { Id } from "../../../../../../../../convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

import Actions from "./data-table-actions";
import { types } from "./data-table-toolbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface InventoryList {
  materialId: Id<"materials">;
  materialName: string;
  quantity: number;
  warehouseId: Id<"warehouses">;
  imageUrl: string | null;
  materialType: string | undefined;
}

export const columns: ColumnDef<InventoryList | null>[] = [
  {
    accessorKey: "materialName",
    header: "Name",
    cell: ({ row }) => {
      const material = row.original;
      if (!material) return <div>N/A</div>; // Handling null or undefined rows

      return (
        <div className="flex items-center justify-start gap-2">
          {material.imageUrl ? (
            <Popover>
              <PopoverTrigger asChild>
                <Image
                  src={material.imageUrl}
                  alt={material.materialName}
                  width={32}
                  height={32}
                />
              </PopoverTrigger>
              <PopoverContent>
                <Image
                  src={material.imageUrl}
                  alt={material.materialName}
                  width={300}
                  height={300}
                />
              </PopoverContent>
            </Popover>
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon size={24} />
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="font-medium">{material.materialName}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "materialType",
    header: "Type",
    cell: ({ row }) => {
      const typeValue = String(row.getValue("materialType"));
      const priority = types.find(
        (priority) => priority.value === typeValue
      ) || { label: typeValue, value: typeValue };

      return (
        <div className="flex items-center">
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const warehouseId = row.original!.warehouseId;
      return <Actions inventory={row.original!} warehouseId={warehouseId} />;
    },
  },
];
