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
import { toast } from "~/components/ui/use-toast";
import { api } from "~/utils/api";

export default function CreateCategoryDialog() {
  const [open, setOpen] = React.useState<boolean>(false);

  const utils = api.useContext();

  const { mutate: createCategory, isLoading } = api.categories.create.useMutation({
    onSuccess: () => {
      void utils.categories.invalidate();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Échec de la création de la catégorie',
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
          New category
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
