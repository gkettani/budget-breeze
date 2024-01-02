import React from "react";
import { CreateFinancialAccountForm } from "~/components/forms/create-financial-account";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

export default function CreateFinancialAccountDialog() {
  const [open, setOpen] = React.useState<boolean>(false);

  const utils = api.useContext();

  const { mutate: createFinancialAccount, isLoading } = api.financialAccounts.create.useMutation({
    onSuccess: () => {
      void utils.financialAccounts.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Échec de la creation du compte',
        variant: 'destructive',
        description: error.message || 'Une erreur est survenue',
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="">
          <Icons.plus className="h-4 w-4 mr-2" />
          New account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Account</DialogTitle>
        </DialogHeader>
        <CreateFinancialAccountForm onSubmit={createFinancialAccount} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
