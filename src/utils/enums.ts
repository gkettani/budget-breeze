export const TRANSACTION_TYPE = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const FINANCIAL_ACCOUNT_TYPE = {
  PAYMENT: 'payment',
  SAVINGS: 'savings',
} as const;

type ObjectValues<T> = T[keyof T];

export type TransactionType = ObjectValues<typeof TRANSACTION_TYPE>;

export type FinancialAccountType = ObjectValues<typeof FINANCIAL_ACCOUNT_TYPE>;
