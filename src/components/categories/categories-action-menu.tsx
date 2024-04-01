import React from "react";
import UpdateCategoryDialog from "~/components/dialogs/update-category";
import UpdateCategoryBudgetDialog from "~/components/dialogs/update-category-budget";
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
import type { Category } from "~/db";
import { api } from "~/utils/api";

export function CategoriesActionMenu({ category }: { category: Category }) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const [showUpdateDialog, setShowUpdateDialog] = React.useState<boolean>(false);
  const [showUpdateBudgetDialog, setShowUpdateBudgetDialog] = React.useState<boolean>(false);

  const utils = api.useContext();

  const { mutate: deleteCategory, isLoading: isDeleteLoading } = api.categories.delete.useMutation({
    onSuccess: () => {
      setShowDeleteAlert(false);
      void utils.categories.invalidate();
      void utils.transactions.invalidate();
    },
    onError: (error) => {
      toast({
        title: 'Échec de la suppression de la catégorie',
        variant: 'destructive',
        description: error.message || 'Une erreur est survenue',
      });
    },
  });

  return (
    <div className="text-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
            <span className="sr-only">Open menu</span>
            <Icons.moreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onSelect={() => setShowUpdateBudgetDialog(true)}
          >
            Assign / Unassign
          </DropdownMenuItem>
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
      <UpdateCategoryDialog category={category} open={showUpdateDialog} setOpen={setShowUpdateDialog} />
      <UpdateCategoryBudgetDialog category={category} open={showUpdateBudgetDialog} setOpen={setShowUpdateBudgetDialog} />
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category{" "}
              <span className="font-medium">{category.name}</span>.<br />
              All the related transactions will be uncategorized.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                deleteCategory({ id: category.id });
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
