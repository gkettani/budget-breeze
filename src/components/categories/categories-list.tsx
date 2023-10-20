import { CategoriesActionMenu } from "~/components/categories/categories-action-menu";
import CreateCategoryDialog from "~/components/create-category-dialog";
import { Icons } from "~/components/icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/utils/api";

export default function CategoriesList() {

  const { data: categories, isLoading } = api.categories.list.useQuery();

  return (
    <Card className="w-[350px]">
      <CardHeader className=" flex-row justify-between items-center">
        <CardTitle className="text-xl">Categories</CardTitle>
        <CreateCategoryDialog />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Icons.spinner className="h-6 w-6 text-primary m-auto animate-spin" />
        ) : (
          <ul className="space-y-4">
            {categories?.map((category) => (
              <li key={category.id} className="border flex justify-between items-center shadow-sm rounded px-4 py-1">
                <p>
                  {category.name}
                </p>
                <CategoriesActionMenu category={category} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
