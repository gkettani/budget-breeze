export const TRANSACTION_TYPE = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

type ObjectValues<T> = T[keyof T];

export type TransactionType = ObjectValues<typeof TRANSACTION_TYPE>;
