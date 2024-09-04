"use client";

import { Doc } from "../../../../../convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ImageIcon } from "lucide-react";
import Image from "next/image";

import { types } from "./data-table-toolbar";
import Actions from "./table-actions";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const columns: ColumnDef<Doc<"materials"> & { url: string | null }>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const material = row.original;

      return (
        <div className="flex items-center justify-start gap-2">
          {material.url ? (
            <Popover>
              <PopoverTrigger asChild>
                <Image
                  src={material.url}
                  alt={material.name}
                  width={35}
                  height={35}
                />
              </PopoverTrigger>
              <PopoverContent>
                <Image
                  src={material.url}
                  alt={material.name}
                  width={300}
                  height={300}
                />
              </PopoverContent>
            </Popover>
          ) : (
            <div
              style={{
                width: 35,
                height: 35,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ImageIcon />
            </div>
          )}

          <div className="font-medium">{name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const typeValue = String(row.getValue("type"));
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
    header: "Ações",
    cell: ({ row }) => {
      return <Actions material={row.original} />;
    },
  },
];
