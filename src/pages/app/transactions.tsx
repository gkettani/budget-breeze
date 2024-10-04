import AppLayout from "~/components/app-layout";
import CreateTransactionDialog from "~/components/dialogs/create-transaction";
import { columns } from "~/components/transactions/columns";
import { DataTable } from "~/components/transactions/data-table";
import { api } from "~/utils/api";


export default function TransactionsPage() {
  const { data: transactions, isLoading: isTransactionsLoading } = api.transactions.list.useQuery();

  return (
    <AppLayout>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-2xl">Transactions</h2>
        </div>
        <CreateTransactionDialog />
      </div>
      <DataTable columns={columns} data={transactions ?? []} isLoading={isTransactionsLoading} />
    </AppLayout>
  );
}
