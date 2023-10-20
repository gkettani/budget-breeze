import type { Category } from "@prisma/client";
import React from "react";
import { UpdateCategory } from "~/components/forms/update-category-form";
import type { UpdateCategoryFormValues } from "~/components/forms/update-category-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";

export function UpdateCategoryDialog({
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
      setOpen(false);
      void utils.categories.invalidate();
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
        <UpdateCategory onSubmit={onSubmit} isLoading={isLoading} category={category} />
      </DialogContent>
    </Dialog>
  );
}
