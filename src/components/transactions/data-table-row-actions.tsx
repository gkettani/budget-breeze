import type { Transaction } from "@prisma/client";
import type { Row } from "@tanstack/react-table";
import React from "react";
import UpdateTransactionDialog from "~/components/dialogs/update-transaction";
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
import { api } from "~/utils/api";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const [showUpdateDialog, setShowUpdateDialog] = React.useState<boolean>(false);

  const transaction = row.original as Transaction;

  const utils = api.useContext();

  const { mutate: deleteTransaction, isLoading: isDeleteLoading } = api.transactions.delete.useMutation({
    onSuccess: () => {
      void utils.transactions.invalidate();
      void utils.financialAccounts.invalidate();
      void utils.categories.invalidate();
      setShowDeleteAlert(false);
    },
    onError: (error) => {
      toast({
        title: 'Échec de la suppression de la transaction',
        variant: 'destructive',
        description: error.message || 'Une erreur est survenue',
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
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(transaction.id)}
          >
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onSelect={() => setShowUpdateDialog(true)}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteAlert(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UpdateTransactionDialog transaction={transaction} open={showUpdateDialog} setOpen={setShowUpdateDialog} />
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                deleteTransaction({ id: transaction.id });
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
    </div>
  );
}
