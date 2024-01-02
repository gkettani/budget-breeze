import { zodResolver } from '@hookform/resolvers/zod';
import type { FinancialAccount } from '@prisma/client';
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
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

const updateFinancialAccountSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  balance: z.coerce.number(),
});

export type UpdateFinancialAccountFormValues = z.infer<typeof updateFinancialAccountSchema>;

export function UpdateFinancialAccountForm({
  onSubmit,
  isLoading,
  financialAccount,
}: {
  onSubmit: (values: UpdateFinancialAccountFormValues) => void;
  isLoading: boolean;
  financialAccount: FinancialAccount;
}) {
  const form = useForm<UpdateFinancialAccountFormValues>({
    resolver: zodResolver(updateFinancialAccountSchema),
    defaultValues: {
      name: financialAccount.name,
      balance: financialAccount.balance,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Balance</FormLabel>
              <FormControl>
                <Input placeholder="Balance" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className='w-full'>
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update Account
        </Button>
      </form>
    </Form>
  );
}