import React from "react";
import { CreateTransactionForm } from "~/components/forms/create-transaction";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";
import { FINANCIAL_ACCOUNT_TYPE } from "~/utils/enums";

export default function CreateTransactionDialog() {
  const [open, setOpen] = React.useState<boolean>(false);

  const utils = api.useContext();

  const { data: categories } = api.categories.list.useQuery();
  const { data: financialAccounts } = api.financialAccounts.list.useQuery();

  const { mutate: createTransaction, isLoading } = api.transactions.create.useMutation({
    onSuccess: () => {
      void utils.transactions.invalidate();
      void utils.financialAccounts.invalidate();
      void utils.categories.invalidate();
      setOpen(false);
      toast({
        title: '✅ Transaction created',
      });
    },
    onError: (error) => {
      toast({
        title: 'Transaction not created',
        variant: 'destructive',
        description: error.message || 'An unexpected error happened !',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="">
          <Icons.plus className="h-4 w-4 mr-2" />
          New transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new transaction</DialogTitle>
          <DialogDescription>
            Start creating a new transaction by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <CreateTransactionForm
          onSubmit={createTransaction}
          categories={categories}
          financialAccounts={financialAccounts?.filter(({ archived, type }) => !archived && type === FINANCIAL_ACCOUNT_TYPE.PAYMENT)}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
