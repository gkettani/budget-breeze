import { type AnyColumn, sql } from 'drizzle-orm';
import type * as schema from './schema';

export const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

export const decrement = (column: AnyColumn, value = 1) => {
  return sql`${column} - ${value}`;
};

export type Category = typeof schema.categories.$inferSelect;
export type FinancialAccount = typeof schema.financialAccounts.$inferSelect;
export type Transaction = typeof schema.transactions.$inferSelect;

export type TransactionUpsert = typeof schema.transactions.$inferInsert;
export type CategoryUpsert = typeof schema.categories.$inferInsert;
export type FinancialAccountUpsert = typeof schema.financialAccounts.$inferInsert;

export * from 'drizzle-orm';
export * as schema from './schema';
export * from './client';
