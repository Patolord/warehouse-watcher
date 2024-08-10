"use client";

import RevertButton from "../../buttons/revert-button";
import { Table } from "@tanstack/react-table";

import { DataTableFacetedFilter } from "./mov-data-table-fac-filter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export const types = [
  {
    label: "Novo",
    value: "Novo",
  },
  {
    label: "Removido",
    value: "Removido",
  },
  {
    label: "Transferência",
    value: "Transferência",
  },
];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex gap-8 items-center justify-around">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn("Tipo") && (
          <DataTableFacetedFilter
            column={table.getColumn("Tipo")}
            title="Tipo"
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
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <RevertButton />
      </div>
    </div>
  );
}
