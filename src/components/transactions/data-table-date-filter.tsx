"use client";

import type { Column } from "@tanstack/react-table";
import React from "react";
import { DateRangePicker } from "~/components/date-range-picker";
import type { DateRange } from "~/types";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>
  title?: string
};

export function DataTableDateFilter<TData, TValue>({
  column,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const selectedDate = column?.getFilterValue() as Partial<DateRange>;

  function handleDateChange(date: Partial<DateRange> | undefined) {
    column?.setFilterValue(date);
  }

  return (
    <DateRangePicker date={selectedDate} setDate={handleDateChange} />
  );
}