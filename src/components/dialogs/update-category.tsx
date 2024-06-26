import React from "react";
import { UpdateCategoryForm } from "~/components/forms/update-category";
import type { UpdateCategoryFormValues } from "~/components/forms/update-category";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { toast } from "~/components/ui/use-toast";
import type { Category } from "~/db";
import { api } from "~/utils/api";

export default function UpdateCategoryDialog({
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

  const onSubmit = (values: UpdateCategoryFormValues) => {
    updatecategory({ id: category.id, ...values });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update category</DialogTitle>
        </DialogHeader>
        <UpdateCategoryForm onSubmit={onSubmit} isLoading={isLoading} category={category} />
      </DialogContent>
    </Dialog>
  );
}
