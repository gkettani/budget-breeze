import React from "react";
import { CreateTransaction } from "~/components/forms/create-transaction-form";
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
import { api } from "~/utils/api";

export default function CreateTransactionDialog() {
  const [open, setOpen] = React.useState<boolean>(false);

  const utils = api.useContext();

  const { mutate: createTransaction, isLoading } = api.transactions.create.useMutation({
    onSuccess: () => {
      setOpen(false);
      void utils.transactions.invalidate();
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
        <CreateTransaction onSubmit={createTransaction} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
