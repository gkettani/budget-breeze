import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Icons } from '~/components/icons';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { amountToCents } from '~/utils/helpers';

const updateCategoryBudgetSchema = z.object({
  amount: z.coerce.number().transform(amountToCents).refine((value) => Number.isInteger(value), {
    message: 'The amount must have up to 2 digits after the decimal point.',
  }),
});

export type UpdateCategoryBudgetFormValues = z.infer<typeof updateCategoryBudgetSchema>;

export function UpdateCategoryBudgetForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (values: UpdateCategoryBudgetFormValues) => void;
  isLoading: boolean;
}) {
  const form = useForm<UpdateCategoryBudgetFormValues>({
    resolver: zodResolver(updateCategoryBudgetSchema),
    defaultValues: {
      amount: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to Assign / Unassign</FormLabel>
              <FormControl>
                <Input placeholder="amount" {...field} />
              </FormControl>
              <FormDescription>
                You can assign or unassign money from this category by entering a positive or negative number.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      <Button type="submit" disabled={isLoading} className='w-full'>
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update budget
        </Button>
      </form>
    </Form>
  );
}
