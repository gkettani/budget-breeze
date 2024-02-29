import { zodResolver } from '@hookform/resolvers/zod';
import type { Category } from '@prisma/client';
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
import { amountToCents, centsToAmount } from '~/utils/helpers';

const updateCategorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  budget: z.coerce.number().transform(amountToCents).refine((value) => Number.isInteger(value), {
    message: 'The amount must have up to 2 digits after the decimal point.',
  }),
  target: z.coerce.number().gte(0).transform(amountToCents).refine((value) => Number.isInteger(value), {
    message: 'The amount must have up to 2 digits after the decimal point.',
  }),
});

export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;

export function UpdateCategoryForm({
  onSubmit,
  isLoading,
  category,
}: {
  onSubmit: (values: UpdateCategoryFormValues) => void;
  isLoading: boolean;
  category: Category;
}) {
  const form = useForm<UpdateCategoryFormValues>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name,
      budget: centsToAmount(category.budget),
      target: centsToAmount(category.target),
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
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
              <FormControl>
                <Input placeholder="Budget" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="target"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target</FormLabel>
              <FormControl>
                <Input placeholder="Target" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <Button type="submit" disabled={isLoading} className='w-full'>
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update category
        </Button>
      </form>
    </Form>
  );
}
