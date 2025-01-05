import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState, ColumnFiltersState } from "@tanstack/react-table";
import * as React from "react";
import { Icons } from "~/components/icons";
import { DataTableDateFilter } from "~/components/transactions/data-table-date-filter";
import { DataTableFacetedFilter } from "~/components/transactions/data-table-faceted-filter";
import { DataTablePagination } from "~/components/transactions/data-table-pagination";
import { DataTableTypeFilter } from "~/components/transactions/data-table-type-filter";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/helpers";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isLoading: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const { data: categories } = api.categories.list.useQuery();
  const { data: financialAccounts } = api.financialAccounts.list.useQuery();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center py-4 gap-5">
        <Input
          placeholder="Filter transactions..."
          value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("description")?.setFilterValue(event.target.value)
          }
          className="max-w-sm h-8"
        />
        {table.getColumn("category") && (
          <DataTableFacetedFilter
            column={table.getColumn("category")}
            title="Category"
            options={categories ?? []}
          />
        )}
        {table.getColumn("financialAccount") && (
          <DataTableFacetedFilter
            column={table.getColumn("financialAccount")}
            title="Account"
            options={financialAccounts ?? []}
          />
        )}
        <DataTableTypeFilter column={table.getColumn("amount")} />
        <DataTableDateFilter column={table.getColumn("date")} />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Icons.xmark className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="bg-muted/70 hover:bg-muted/70" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {(!isLoading && table.getRowModel().rows?.length) ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? <Icons.spinner className="h-6 w-6 text-primary m-auto animate-spin" /> : "No transactions found."}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground">
                Total: {formatCurrency(table.getFilteredRowModel().rows.reduce((acc, row) => {
                  return acc + parseInt(row.getValue("amount"));
                }, 0))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
