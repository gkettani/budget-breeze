"use client";

import type { Column } from "@tanstack/react-table";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TRANSACTION_TYPE } from "~/utils/enums";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
};

export function DataTableTypeFilter<TData, TValue>({
  column,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const type = (column?.getFilterValue() ?? "") as string;

  function handleTypeChange(type: string) {
    column?.setFilterValue(type);
  }

  return (
    <Select onValueChange={handleTypeChange} value={type}>
      <SelectTrigger className="w-[130px] border-dashed shadow-none">
        <SelectValue placeholder="Type"/>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={TRANSACTION_TYPE.EXPENSE}>Expense</SelectItem>
          <SelectItem value={TRANSACTION_TYPE.INCOME}>Income</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}