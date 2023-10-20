import type { Transaction } from "@prisma/client";
import React from "react";
import { UpdateTransaction } from "~/components/forms/update-transaction-form";
import type { UpdateTransactionFormValues } from "~/components/forms/update-transaction-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";

export function UpdateTransactionDialog({
  transaction,
  open,
  setOpen,
}: {
  transaction: Transaction;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {

  const utils = api.useContext();

  const { data: categories } = api.categories.list.useQuery();

  const { mutate: updateTransaction, isLoading } = api.transactions.update.useMutation({
    onSuccess: () => {
      setOpen(false);
      void utils.transactions.invalidate();
    },
  });

  const onSubmit = (values: UpdateTransactionFormValues) => {
    updateTransaction({ id: transaction.id, ...values });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update transaction</DialogTitle>
          <DialogDescription>
            Update the transaction details below
          </DialogDescription>
        </DialogHeader>
        <UpdateTransaction onSubmit={onSubmit} isLoading={isLoading} transaction={transaction} categories={categories} />
      </DialogContent>
    </Dialog>
  );
}
