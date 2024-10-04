import AppLayout from "~/components/app-layout";
import CreateFinancialAccountDialog from "~/components/dialogs/create-financial-account";
import FinancialAccountsList from "~/components/financial-accounts/financial-accounts-list";
import { api } from "~/utils/api";

export default function AccountsPage() {
  const { data: financialAccounts, isLoading: isFinancialAccountsLoading } = api.financialAccounts.list.useQuery();
  return (
    <AppLayout>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-bold text-2xl">Accounts</h2>
        </div>
        <CreateFinancialAccountDialog />
      </div>
      <FinancialAccountsList financialAccounts={financialAccounts} isLoading={isFinancialAccountsLoading} />
    </AppLayout>
  );
}
