import React from "react";
import CreateCategoryDialog from "~/components/create-category-dialog";
import CreateTransactionDialog from "~/components/create-transaction-dialog";
import { columns } from "~/components/transactions/columns";
import { DataTable } from "~/components/transactions/data-table";
import { api } from "~/utils/api";

export default function Transactions() {
  const { data: transactions, isLoading: isTransactionsLoading } = api.transactions.list.useQuery();
  console.log(transactions);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-2xl">Transactions</h2>
        </div>
        <div className="flex gap-5">
          <CreateCategoryDialog />
          <CreateTransactionDialog />
        </div>
      </div>
      <DataTable columns={columns} data={transactions ?? []} isLoading={isTransactionsLoading} />
    </div>
  );
}
