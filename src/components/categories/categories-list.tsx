import type { Category } from "@prisma/client";
import { CategoriesActionMenu } from "~/components/categories/categories-action-menu";
import CreateCategoryDialog from "~/components/dialogs/create-category";
import { Icons } from "~/components/icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export default function CategoriesList({ categories, isLoading }: { categories?: Category[]; isLoading: boolean; }) {

  return (
    <Card className="w-[350px] mt-10">
      <CardHeader className=" flex-row justify-between items-center">
        <CardTitle className="text-xl">Categories</CardTitle>
        <CreateCategoryDialog />
      </CardHeader>
      <CardContent>
        {(!isLoading && categories?.length) ? (
          <ul className="space-y-4">
            {categories?.map((category) => (
              <li key={category.id} className="border flex justify-between items-center shadow-sm rounded px-4 py-1">
                <p>
                  {category.name} <br />
                  <span className='text-slate-500'>{formatCurrency(category.budget)}</span>
                </p>
                <CategoriesActionMenu category={category} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {isLoading ? (
              <Icons.spinner className="h-6 w-6 text-primary animate-spin" />
            ) : (
              <>
                <Icons.folder className="h-8 w-8 text-primary" />
                <p className="text-primary">No categories yet</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
