import React from "react";
import { UpdateTransactionForm } from "~/components/forms/update-transaction";
import type { UpdateTransactionFormValues } from "~/components/forms/update-transaction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { toast } from "~/components/ui/use-toast";
import type { Transaction } from "~/db";
import { api } from "~/utils/api";

export default function UpdateTransactionDialog({
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
      void utils.transactions.invalidate();
      void utils.financialAccounts.invalidate();
      void utils.categories.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Échec de la mise à jour de la transaction',
        variant: 'destructive',
        description: error.message || 'Une erreur est survenue',
      });
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
        <UpdateTransactionForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          transaction={transaction}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
}
