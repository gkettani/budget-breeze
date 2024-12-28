import { Card as TremorCard, Metric, Text, Flex, Grid } from "@tremor/react";
import { CategoriesActionMenu } from "~/components/categories/categories-action-menu";
import CreateCategoryDialog from "~/components/dialogs/create-category";
import { Icons } from "~/components/icons";
import { Progress } from "~/components/ui/progress";
import { cn } from "~/lib/utils";
import { type RouterOutputs } from "~/utils/api";
import { formatCurrency } from "~/utils/helpers";

type EnrichedCategory = RouterOutputs["categories"]["list"][0];

export default function CategoriesList({
  categories,
  isLoading,
  className,
}: {
  categories?: EnrichedCategory[];
  isLoading: boolean;
  className?: string;
}) {

  return (
    <div className={cn("", className)}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-2xl">Categories</h2>
        </div>
        <CreateCategoryDialog />
      </div>
      <Grid numItemsSm={2} numItemsMd={3} numItemsLg={4} className="gap-6 mt-4">
        {(!isLoading && categories?.length) ? (
          categories
            .map((item) => (
              <TremorCard key={item.id}>
                <Flex className="">
                  <Text>{item.name}</Text>
                  <CategoriesActionMenu category={item} />
                </Flex>
                <Metric>{formatCurrency(item.budget)}</Metric>
                <Flex className="mt-4">
                  <Text className="truncate">{`${item.monthExpensePercentage.toFixed(2)}% • ${formatCurrency(item.monthExpenseTotal)}`}</Text>
                  <Text>{formatCurrency(item.target)}</Text>
                </Flex>
                <Progress className="mt-2" value={item.monthExpensePercentage} variant={item.monthExpensePercentage > 100 ? "error" : "default"}/>
              </TremorCard>
            ))
        ) : (
          <div className="flex flex-col items-center justify-center col-span-full">
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
      </Grid>
    </div>
  );
}
