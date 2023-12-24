import React from "react";
import CategoriesList from "~/components/categories/categories-list";
import CreateTransactionDialog from "~/components/dialogs/create-transaction";
import FinancialAccountsList from "~/components/financial-accounts/financial-accounts-list";
import { columns } from "~/components/transactions/columns";
import { DataTable } from "~/components/transactions/data-table";
import { api } from "~/utils/api";

export default function Transactions() {
  const { data: transactions, isLoading: isTransactionsLoading } = api.transactions.list.useQuery();
  const { data: categories, isLoading: isCategoriesLoading } = api.categories.list.useQuery();
  const { data: financialAccounts, isLoading: isFinancialAccountsLoading } = api.financialAccounts.list.useQuery();

  // calculate the total amount of all transactions for each category
  const categoriesWithTotalAmount = React.useMemo(() => {
    if (!transactions || !categories) return [];

    const res = categories
      .map((category) => {
        const totalAmount = transactions.reduce((acc, transaction) => {
          if (transaction.categoryId === category.id) {
            return acc + transaction.amount;
          }
          return acc;
        }, 0);

        return {
          id: category.id,
          name: category.name,
          totalAmount,
        };
      });

    res.push({
      id: '',
      name: 'Uncategorized',
      totalAmount: transactions.reduce((acc, transaction) => {
        if (!transaction.categoryId) {
          return acc + transaction.amount;
        }
        return acc;
      }, 0),
    });

    return res;
  }, [transactions, categories]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-2xl">Transactions</h2>
        </div>
        <CreateTransactionDialog />
      </div>
      <DataTable columns={columns} data={transactions ?? []} isLoading={isTransactionsLoading} />
      {/* Print money to assign */}
      <p>
        Money to assign:{" "}
        {new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(
          (financialAccounts?.reduce((acc, account) => acc + account.balance, 0) ?? 0) - (categories?.reduce((acc, category) => acc + category.budget, 0) ?? 0),
        )}
      </p>
      <FinancialAccountsList financialAccounts={financialAccounts} isLoading={isFinancialAccountsLoading} />
      <CategoriesList categories={categories} isLoading={isCategoriesLoading} />
      {categoriesWithTotalAmount.length > 0 && (
        <div className="mt-10 w-[350px]">
          <h3 className="font-bold text-xl">Categories Statistics</h3>
          <ul className="mt-4 space-y-4">
            {categoriesWithTotalAmount.map((category) => (
              <li key={category.id} className="border flex justify-between items-center shadow-sm rounded px-4 py-1">
                <p>
                  {category.name}
                </p>
                <p>
                  {new Intl.NumberFormat("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  }).format(category.totalAmount)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
