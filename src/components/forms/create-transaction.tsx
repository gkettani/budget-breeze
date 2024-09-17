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
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Category, FinancialAccount } from '~/db';
import { cn } from "~/lib/utils";
import { formatDate, NewUtcDate } from '~/utils/date';
import { TRANSACTION_TYPE } from '~/utils/enums';
import { POSITIVE_FLOAT_REGEX, amountToCents } from '~/utils/helpers';

const createTransactionSchema = z.object({
  description: z.string().min(1, { message: 'You must provide a description' }),
  amount: z.coerce.string().regex(POSITIVE_FLOAT_REGEX, {
    message: 'The amount must be a number greater than 0 with up to 2 digits after the decimal point. Commas are not valid',
  }).transform((value) => { console.log(value); return amountToCents(parseFloat(value));}),
  date: z.date({
    required_error: 'Date is required',
  }),
  categoryId: z.coerce.number().transform((val) => (val === -1 ? undefined : val)).optional(),
  financialAccountId: z.coerce.number({
    required_error: 'You must select an account',
  }),
  type: z.union([
    z.literal(TRANSACTION_TYPE.INCOME),
    z.literal(TRANSACTION_TYPE.EXPENSE),
  ]),
});

export type CreateTransactionFormValues = z.infer<typeof createTransactionSchema>;

export function CreateTransactionForm({
  onSubmit,
  isLoading,
  categories,
  financialAccounts,
}: {
  onSubmit: (values: CreateTransactionFormValues) => void;
  isLoading: boolean;
  categories: Category[] | undefined;
  financialAccounts: FinancialAccount[] | undefined;
}) {
  const form = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      description: '',
      amount: 0,
      date: NewUtcDate(),
      type: TRANSACTION_TYPE.EXPENSE,
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input placeholder="Amount" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-6 my-6"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={TRANSACTION_TYPE.EXPENSE} />
                    </FormControl>
                    <FormLabel className="cursor-pointer hover:underline">
                      Expense
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={TRANSACTION_TYPE.INCOME} />
                    </FormControl>
                    <FormLabel className="cursor-pointer hover:underline">
                      Income
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
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
        <FormField
          control={form.control}
          name="financialAccountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an account" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {financialAccounts?.map((financialAccount) => (
                    <SelectItem
                      key={financialAccount.id}
                      value={financialAccount.id.toString()}
                      className="text-sm"
                    >
                      {financialAccount.name}
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
          Create transaction
        </Button>
      </form>
    </Form>
  );
}
