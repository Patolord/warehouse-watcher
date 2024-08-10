"use client";

import { Doc } from "../../../../../convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Doc<"warehouses">>[] = [
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

      return (
        <div className="flex items-center justify-start gap-2">
          <div className="font-medium">{name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "address",
    header: () => <div className="text-center">Endereço</div>,
    cell: ({ row }) => {
      const address = row.getValue("address") as string;

      return <div className="text-center font-medium">{address}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const warehouse = row.original;

      return (
        <Link
          href={`/dashboard/warehouses/${warehouse._id}`}
          className="h-7 w-7 flex items-center justify-center"
        >
          <Button size="sm" variant="secondary">
            Ver Estoque
          </Button>
        </Link>
      );
    },
  },
];
