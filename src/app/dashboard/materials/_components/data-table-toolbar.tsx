"use client";

import { Table } from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";

export const types = [
  {
    label: "Other",
    value: "Other",
  },
];

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const types = useQuery(api.materials.getUniqueMaterialTypesByUser);

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Search materials..."
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
            title="Type"
            options={types || []}
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
