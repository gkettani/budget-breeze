import type { FinancialAccount } from "@prisma/client";
import CreateFinancialAccountDialog from "~/components/dialogs/create-financial-account";
import { FinancialAccountsActionMenu } from "~/components/financial-accounts/financial-accounts-action-menu";
import { Icons } from "~/components/icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatCurrency } from "~/utils/helpers";

export default function FinancialAccountsList({ financialAccounts, isLoading }: { financialAccounts?: FinancialAccount[]; isLoading: boolean; }) {

  return (
    <Card className="w-[350px] my-10">
      <CardHeader className=" flex-row justify-between items-center">
        <CardTitle className="text-xl">Accounts</CardTitle>
        <CreateFinancialAccountDialog />
      </CardHeader>
      <CardContent>
        {(!isLoading && financialAccounts?.length) ? (
          <ul className="space-y-4">
            {financialAccounts?.map((financialAccount) => (
              <li key={financialAccount.id} className="border flex justify-between items-center shadow-sm rounded px-4 py-1">
                <p>
                  {financialAccount.name} <br />
                  <span className='text-slate-500'>{formatCurrency(financialAccount.balance)}</span>
                </p>
                <FinancialAccountsActionMenu financialAccount={financialAccount} />
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
                <p className="text-primary">No account yet</p>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
