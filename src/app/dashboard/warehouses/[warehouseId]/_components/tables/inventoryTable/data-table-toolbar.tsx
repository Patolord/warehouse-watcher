"use client";

import { api } from "../../../../../../../../convex/_generated/api";
import { Table } from "@tanstack/react-table";
import { useQuery } from "convex/react";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const types = [
  {
    label: "Animal",
    value: "Animal",
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

  let types2 = useQuery(api.materials.getUniqueMaterialTypes2);

  if (!types2) {
    types2 = [];
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filtrar materiais..."
          value={
            (table.getColumn("materialName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("materialName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("materialType") && (
          <DataTableFacetedFilter
            column={table.getColumn("materialType")}
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
