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
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { FLOAT_REGEX, amountToCents } from '~/utils/helpers';

const createFinancialAccountSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  balance: z.coerce.string().regex(FLOAT_REGEX, {
    message: 'The balance must be a number with up to 2 digits after the decimal point.',
  }).transform((value) => amountToCents(parseFloat(value))),
});

export type CreateFinancialAccountFormValues = z.infer<typeof createFinancialAccountSchema>;

export function CreateFinancialAccountForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (values: CreateFinancialAccountFormValues) => void;
  isLoading: boolean;
}) {
  const form = useForm<CreateFinancialAccountFormValues>({
    resolver: zodResolver(createFinancialAccountSchema),
    defaultValues: {
      name: '',
      balance: 0,
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
          Create Account
        </Button>
      </form>
    </Form>
  );
}
