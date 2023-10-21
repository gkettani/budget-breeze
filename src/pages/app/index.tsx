import React from "react";
import CategoriesList from "~/components/categories/categories-list";
import CreateTransactionDialog from "~/components/create-transaction-dialog";
import { columns } from "~/components/transactions/columns";
import { DataTable } from "~/components/transactions/data-table";
import { api } from "~/utils/api";

export default function Transactions() {
  const { data: transactions, isLoading: isTransactionsLoading } = api.transactions.list.useQuery();
  const { data: categories, isLoading: isCategoriesLoading } = api.categories.list.useQuery();

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
      <CategoriesList categories={categories} isLoading={isCategoriesLoading} />
      {categoriesWithTotalAmount.length > 0 && (
        <div className="mt-10 w-[350px]">
          <h3 className="font-bold text-xl">Categories</h3>
          <ul className="mt-4 space-y-4">
            {categoriesWithTotalAmount.map((category) => (
              <li key={category.id} className="border flex justify-between items-center shadow-sm rounded px-4 py-1">
                <p>
                  {category.name}
                </p>
                <p>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
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
