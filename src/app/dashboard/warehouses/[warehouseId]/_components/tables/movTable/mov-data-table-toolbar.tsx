"use client";

import { Table } from "@tanstack/react-table";

import { DataTableFacetedFilter } from "./mov-data-table-fac-filter";
import { Button } from "@/components/ui/button";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const types = [
    {
      label: "Added",
      value: "added",
    },
    {
      label: "Removed",
      value: "removed",
    },
    {
      label: "Transfered",
      value: "transfered",
    },
  ];

  return (
    <div className="flex gap-8 items-center justify-around">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("action_type") && (
          <DataTableFacetedFilter
            column={table.getColumn("action_type")}
            title="Type"
            options={types}
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
