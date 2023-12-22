import type { FinancialAccount } from "@prisma/client";
import React from "react";
import { UpdateFinancialAccountForm } from "~/components/forms/update-financial-account";
import type { UpdateFinancialAccountFormValues } from "~/components/forms/update-financial-account";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";

export default function UpdateFinancialAccountDialog({
  financialAccount,
  open,
  setOpen,
}: {
  financialAccount: FinancialAccount;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {

  const utils = api.useContext();

  const { mutate: updatefinancialAccount, isLoading } = api.financialAccounts.update.useMutation({
    onSuccess: () => {
      void utils.financialAccounts.invalidate();
      setOpen(false);
    },
  });

  const onSubmit = (values: UpdateFinancialAccountFormValues) => {
    updatefinancialAccount({ id: financialAccount.id, ...values });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update account</DialogTitle>
        </DialogHeader>
        <UpdateFinancialAccountForm onSubmit={onSubmit} isLoading={isLoading} financialAccount={financialAccount} />
      </DialogContent>
    </Dialog>
  );
}
