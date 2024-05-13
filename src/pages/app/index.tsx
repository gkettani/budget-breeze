import { Card, Grid, Text, Metric } from "@tremor/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import React from "react";
import BarChartContainer from "~/components/bar-chart";
import CategoriesList from "~/components/categories/categories-list";
import CreateTransactionDialog from "~/components/dialogs/create-transaction";
import DonutChartContainer from "~/components/donut-chart";
import FinancialAccountsList from "~/components/financial-accounts/financial-accounts-list";
import { Icons } from "~/components/icons";
import { columns } from "~/components/transactions/columns";
import { DataTable } from "~/components/transactions/data-table";
import { Toaster } from "~/components/ui/toaster";
import { UserAccountNav } from "~/components/user-account-nav";
import { siteConfig } from "~/config/site";
import { api } from "~/utils/api";
import { formatCurrency } from "~/utils/helpers";

export default function App() {
  const { data: transactions, isLoading: isTransactionsLoading } = api.transactions.list.useQuery();
  const { data: categories, isLoading: isCategoriesLoading } = api.categories.list.useQuery();
  const { data: financialAccounts, isLoading: isFinancialAccountsLoading } = api.financialAccounts.list.useQuery();

  const donutData = categories
    ?.filter((category) => category.monthExpenseTotal > 0)
    ?.map((category) => ({
      id: category.id,
      name: category.name,
      value: category.monthExpenseTotal,
    })) ?? [];

  const assignedMoney = categories?.reduce((acc, category) => acc + Number(category.budget), 0) ?? 0;
  const monthTotalExpenses = categories?.reduce((acc, category) => acc + Number(category.monthExpenseTotal), 0) ?? 0;
  const totalMoney = financialAccounts?.reduce((acc, account) => acc + Number(account.balance), 0) ?? 0;

  const metrics = [
    { title: "Wallet Balance", metric: formatCurrency(totalMoney) },
    { title: "Current Month Spending", metric: formatCurrency(monthTotalExpenses) },
    { title: "To Assign", metric: formatCurrency(totalMoney - assignedMoney) },
  ];

  const { data: session } = useSession();

  return (
    <div>
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div>
            <Link href="/" className="hidden items-center space-x-2 md:flex">
              <Icons.logo className='h-6 w-6' />
              <span className="hidden font-bold font-heading text-primary text-lg sm:inline-block">
                {siteConfig.name}
              </span>
            </Link>
          </div>
          <UserAccountNav
            user={{
              name: session?.user?.name ?? "",
              image: session?.user?.image ?? "",
              email: session?.user?.email ?? "",
            }}
          />
        </div>
      </header>
      <div className="container mx-auto py-10">
        <Grid numItemsSm={2} numItemsLg={3} className="gap-6 mb-5">
          {metrics.map((item) => (
            <Card key={item.title}>
              <Text>{item.title}</Text>
              <Metric>{item.metric}</Metric>
            </Card>
          ))}
        </Grid>
        <CategoriesList className="mb-10" categories={categories} isLoading={isCategoriesLoading} />
        <FinancialAccountsList financialAccounts={financialAccounts} isLoading={isFinancialAccountsLoading} />
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-bold text-2xl">Transactions</h2>
          </div>
          <CreateTransactionDialog />
        </div>
        <DataTable columns={columns} data={transactions ?? []} isLoading={isTransactionsLoading} />
        <DonutChartContainer data={donutData} />
        <BarChartContainer data={transactions ?? []} />
      </div>
      <Toaster />
    </div>
  );
}
