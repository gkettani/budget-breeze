'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import * as React from 'react';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { cn } from '~/lib/utils';
import type { DateRange } from '~/types';

interface DateRangePickerProps {
  date: Partial<DateRange> | undefined;
  setDate: (date: Partial<DateRange> | undefined) => void;
}

export function DateRangePicker({
  date,
  setDate,
}: DateRangePickerProps) {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            'w-[260px] justify-start text-left font-normal border-dashed',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={{ from: date?.from ?? new Date(), to: date?.to }}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  );
}
