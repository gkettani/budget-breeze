import React from "react";
import { CreateCategoryForm } from "~/components/forms/create-category";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";

export default function CreateCategoryDialog() {
  const [open, setOpen] = React.useState<boolean>(false);

  const utils = api.useContext();

  const { mutate: createCategory, isLoading } = api.categories.create.useMutation({
    onSuccess: () => {
      void utils.categories.invalidate();
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-8 w-8 p-0">
          <Icons.plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new category</DialogTitle>
        </DialogHeader>
        <CreateCategoryForm onSubmit={createCategory} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
