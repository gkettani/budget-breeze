import type { Category, Transaction, FinancialAccount } from '@prisma/client';
import type { ColumnDef } from "@tanstack/react-table";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import type { DateRange } from "~/types";
import { formatCurrency } from '~/utils/helpers';
import { DataTableRowActions } from "./data-table-row-actions";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: () => <div className="pl-4">Description</div>,
    cell: ({ row }) => {
      return <div className="pl-4">{row.getValue("description")}</div>;
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <Icons.chevronsUpDown className="ml-2 w-3 h-3"/>
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = new Intl.DateTimeFormat("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);

      return <div>{formatted}</div>;
    },
    filterFn: (row, id, value: Partial<DateRange> | undefined) => {
      if (!value || (!value.from && !value.to)) return true;

      const date = new Date(row.getValue(id));
      const fromDate = value.from ? value.from : new Date(0); // Default to the beginning of time
      const toDate = value.to ? value.to : new Date(); // Default to current date

      return date >= fromDate && date <= toDate;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="text-right">
        <Button
          variant="ghost"
          className=""
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <Icons.chevronsUpDown className="ml-2 w-3 h-3"/>
        </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseInt(row.getValue("amount"));

      return <div className="text-right font-medium pr-5">{formatCurrency(amount)}</div>;
    },
  },
  {
    accessorKey: "category",
    header: () => <div className="text-center">Category</div>,
    cell: ({ row }) => {
      const category: Category = row.getValue("category");
      return <div className="text-center">{category?.name || 'uncategorized'}</div>;
    },
    filterFn: (row, id, value: string) => {
      const category: Category = row.getValue(id);
      return value.includes(category?.name ?? 'uncategorized');
    },
  },
  {
    accessorKey: "financialAccount",
    header: () => <div className="text-center">Account</div>,
    cell: ({ row }) => {
      const account: FinancialAccount = row.getValue("financialAccount");
      return <div className="text-center">{account?.name}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
