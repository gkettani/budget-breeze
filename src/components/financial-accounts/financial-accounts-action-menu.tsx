import React from "react";
import UpdateFinancialAccountDialog from "~/components/dialogs/update-financial-account";
import { Icons } from "~/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { toast } from "~/components/ui/use-toast";
import type { FinancialAccount } from "~/db";
import { api } from "~/utils/api";

export function FinancialAccountsActionMenu({
  financialAccount,
}: {
  financialAccount: FinancialAccount;
}) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const [showUpdateDialog, setShowUpdateDialog] =
    React.useState<boolean>(false);
  const [showArchiveDialog, setShowArchiveDialog] =
    React.useState<boolean>(false);

  const utils = api.useContext();

  const { mutate: deleteFinancialAccount, isLoading: isDeleteLoading } =
    api.financialAccounts.delete.useMutation({
      onSuccess: () => {
        void utils.financialAccounts.invalidate();
        void utils.transactions.invalidate();
        setShowDeleteAlert(false);
      },
      onError: (error) => {
        toast({
          title: "Failed to delete the account",
          variant: "destructive",
          description: error.message || "An unexpected error happened.",
        });
      },
    });

  const { mutate: toggleArchiveAccount, isLoading: isArchiveLoading } =
    api.financialAccounts.update.useMutation({
      onSuccess: () => {
        void utils.financialAccounts.invalidate();
        setShowArchiveDialog(false);
      },
      onError: (error) => {
        toast({
          title: `Failed to ${financialAccount.archived ? 'restore' : 'archive'} the account`,
          variant: "destructive",
          description: error.message || "An unexpected error happened.",
        });
      },
    });

  return (
    <div className="text-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <Icons.moreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onSelect={() => setShowUpdateDialog(true)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onSelect={() => setShowArchiveDialog(true)}
          >
            {financialAccount.archived ? 'Restore' : 'Archive'}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteAlert(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateFinancialAccountDialog
        financialAccount={financialAccount}
        open={showUpdateDialog}
        setOpen={setShowUpdateDialog}
      />
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the account
              <span className="font-semibold"> {financialAccount.name}</span>.
              It will also delete all transactions associated with this account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                deleteFinancialAccount({ id: financialAccount.id });
              }}
              className="bg-destructive hover:bg-destructive/80"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{financialAccount.archived ? 'Restore' : 'Archive'} the account</AlertDialogTitle>
            <AlertDialogDescription>
              This action will {financialAccount.archived ? 'restore' : 'archive'} the account {' '}
              <span className="font-  ">{financialAccount.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                toggleArchiveAccount({ id: financialAccount.id, archived: !financialAccount.archived });
              }}
              className="bg-primary hover:bg-primary/80"
            >
              {isArchiveLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.archive className="mr-2 h-4 w-4" />
              )}
              <span>{financialAccount.archived ? 'Restore' : 'Archive'}</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
