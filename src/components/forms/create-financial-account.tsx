import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { FINANCIAL_ACCOUNT_TYPE } from "~/utils/enums";
import { FLOAT_REGEX, amountToCents } from "~/utils/helpers";

const createFinancialAccountSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  balance: z.coerce
    .string()
    .regex(FLOAT_REGEX, {
      message:
        "The balance must be a number with up to 2 digits after the decimal point.",
    })
    .transform((value) => amountToCents(parseFloat(value))),
  type: z.union([
    z.literal(FINANCIAL_ACCOUNT_TYPE.PAYMENT),
    z.literal(FINANCIAL_ACCOUNT_TYPE.SAVINGS),
  ]),
});

export type CreateFinancialAccountFormValues = z.infer<
  typeof createFinancialAccountSchema
>;

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
      name: "",
      balance: 0,
      type: FINANCIAL_ACCOUNT_TYPE.PAYMENT,
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="my-6 gap-4"
                >
                  <FormLabel>Account type</FormLabel>
                  <div className="flex gap-6">
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={FINANCIAL_ACCOUNT_TYPE.PAYMENT} />
                    </FormControl>
                    <FormLabel className="cursor-pointer hover:underline">
                      Payment
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={FINANCIAL_ACCOUNT_TYPE.SAVINGS} />
                    </FormControl>
                    <FormLabel className="cursor-pointer hover:underline">
                      Savings
                    </FormLabel>
                  </FormItem>
                  </div>
                </RadioGroup>
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
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>
    </Form>
  );
}
