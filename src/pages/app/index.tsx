import { Card, Grid, Text, Metric } from "@tremor/react";
import React from "react";
import AppLayout from "~/components/app-layout";
import BarChartContainer from "~/components/bar-chart";
import CategoriesList from "~/components/categories/categories-list";
import DonutChartContainer from "~/components/donut-chart";
import { Icons } from "~/components/icons";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { api } from "~/utils/api";
import { TRANSACTION_TYPE } from "~/utils/enums";
import { formatCurrency } from "~/utils/helpers";

export default function App() {
  const { data: transactions } = api.transactions.list.useQuery();
  const { data: categories, isLoading: isCategoriesLoading } = api.categories.list.useQuery();
  const { data: financialAccounts } = api.financialAccounts.list.useQuery();

  const donutData = categories
    ?.filter((category) => category.monthExpenseTotal > 0)
    ?.map((category) => ({
      id: category.id,
      name: category.name,
      value: category.monthExpenseTotal,
    })) ?? [];

  const assignedMoney = categories?.reduce((acc, category) => acc + category.budget, 0) ?? 0;
  const monthTotalExpenses = transactions
    ?.filter(t => t.type === TRANSACTION_TYPE.EXPENSE)
    ?.filter(t => t.date > new Date(new Date().getFullYear(), new Date().getMonth(), 1))
    ?.reduce((acc, transaction) => acc + transaction.amount, 0) ?? 0;
  const totalMoney = financialAccounts?.reduce((acc, account) => acc + account.balance, 0) ?? 0;

  const expenseProjection = categories?.reduce((acc, category) => acc + Math.max(category.target, category.monthExpenseTotal), 0) ?? 0;

  const metrics = [
    { title: "Balance", metric: formatCurrency(totalMoney) },
    { title: "Monthly expenses", metric: formatCurrency(monthTotalExpenses), projection: formatCurrency(expenseProjection) },
    { title: "To Assign", metric: formatCurrency(totalMoney - assignedMoney) },
  ];

  return (
    <AppLayout>
      <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mb-5">
        {metrics.map((item) => (
          <Card key={item.title} decoration="top" decorationColor="indigo">
            <Text>{item.title}</Text>
            <Metric className="mt-5">{item.metric}</Metric>
            {item.projection && (
              <div className="font-light text-sm text-tremor-content flex items-center gap-2">
                <span>End of month projection</span>
                <span className="font-medium text-tremor-content-emphasis">{item.projection}</span>
                <HoverCard openDelay={400} closeDelay={200}>
                  <HoverCardTrigger><Icons.info className="w-4 hover:cursor-pointer hover:text-gray-800" /></HoverCardTrigger>
                  <HoverCardContent>
                    The projected value is calculated based on the targets set for each spending category.
                  </HoverCardContent>
                </HoverCard>
              </div>
            )}
          </Card>
        ))}
      </Grid>
      <div className="grid lg:grid-cols-5 gap-6">
        <DonutChartContainer data={donutData} />
        <BarChartContainer data={transactions ?? []} />
      </div>
      <CategoriesList className="my-10" categories={categories} isLoading={isCategoriesLoading} />
    </AppLayout>
  );
}
