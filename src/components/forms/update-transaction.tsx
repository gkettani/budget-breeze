import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from "@radix-ui/react-icons";
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import { Calendar } from "~/components/ui/calendar";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Category, Transaction } from "~/db";
import { cn } from "~/lib/utils";
import { formatDate, NewUtcDate } from '~/utils/date';

const updateTransactionSchema = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  date: z.date({
    required_error: 'Date is required',
  }),
  categoryId: z.coerce.number().transform((val) => (val === -1 ? null : val)).nullable(),
});

export type UpdateTransactionFormValues = z.infer<typeof updateTransactionSchema>;

export function UpdateTransactionForm({
  onSubmit,
  isLoading,
  transaction,
  categories,
}: {
  onSubmit: (values: UpdateTransactionFormValues) => void;
  isLoading: boolean;
  transaction: Transaction;
  categories: Category[] | undefined;
}) {
  const form = useForm<UpdateTransactionFormValues>({
    resolver: zodResolver(updateTransactionSchema),
    defaultValues: {
      description: transaction.description,
      categoryId: transaction.categoryId,
      date: transaction.date,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          formatDate(field.value)
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={date => field.onChange(NewUtcDate(date))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={transaction.categoryId?.toString()}
                value={(field.value?.toString() === "-1" ? "" : field.value?.toString())}
                >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category for you transaction" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="-1" className="text-sm">
                    No category
                  </SelectItem>
                  {categories?.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                      className="text-sm"
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className='w-full'>
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update transaction
        </Button>
      </form>
    </Form>
  );
}
