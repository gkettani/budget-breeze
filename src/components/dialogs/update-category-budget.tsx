import type { Category } from "@prisma/client";
import React from "react";
import { UpdateCategoryBudgetForm } from "~/components/forms/update-category-budget";
import type { UpdateCategoryBudgetFormValues } from "~/components/forms/update-category-budget";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

export default function UpdateCategoryBudgetDialog({
  category,
  open,
  setOpen,
}: {
  category: Category;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {

  const utils = api.useContext();

  const { mutate: updatecategory, isLoading } = api.categories.update.useMutation({
    onSuccess: () => {
      void utils.categories.invalidate();
      void utils.transactions.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Échec de la mise à jour de la catégorie',
        variant: 'destructive',
        description: error.message || 'Une erreur est survenue',
      });
    },
  });

  const onSubmit = (values: UpdateCategoryBudgetFormValues) => {
    updatecategory({
      id: category.id,
      budget: values.amount + Number(category.budget),
     });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Budget</DialogTitle>
          <DialogDescription>
            Enter the amount you want to add or remove from the budget of this category.
          </DialogDescription>
        </DialogHeader>
        <UpdateCategoryBudgetForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
