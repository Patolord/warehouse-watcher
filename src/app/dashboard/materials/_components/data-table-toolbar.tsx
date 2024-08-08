"use client";

import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export const types = [
  {
    label: "Boca de Ar",
    value: "Boca de Ar",
  },
  {
    label: "Cobre",
    value: "Cobre",
  },
  {
    label: "PVC",
    value: "PVC",
  },
  {
    label: "Gás",
    value: "Gás",
  },
  {
    label: "Outro",
    value: "Outro",
  },
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const types2 = useQuery(api.materials.getUniqueMaterialTypes2);

  const isLoading = !types2;

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filtrar materiais..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Tipo"
            options={types2}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
