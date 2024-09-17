import { z } from "zod";
import { schema, eq, desc, and, decrement, increment } from '~/db';
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRANSACTION_TYPE } from "~/utils/enums";

export const transactionsRouter = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const { db } = ctx;

      const transactions = await db
        .select({
          id: schema.transactions.id,
          description: schema.transactions.description,
          date: schema.transactions.date,
          amount: schema.transactions.amount,
          type: schema.transactions.type,
          categoryId: schema.transactions.categoryId,
          financialAccountId: schema.transactions.financialAccountId,
          category: {
            id: schema.categories.id,
            name: schema.categories.name,
          },
          financialAccount: {
            id: schema.financialAccounts.id,
            name: schema.financialAccounts.name,
          },
        })
        .from(schema.transactions)
        .where(eq(schema.transactions.userId, ctx.session.user.id))
        .leftJoin(schema.categories, eq(schema.categories.id, schema.transactions.categoryId))
        .leftJoin(schema.financialAccounts, eq(schema.financialAccounts.id, schema.transactions.financialAccountId))
        .orderBy(desc(schema.transactions.date));

      return transactions;
    }),

  create: protectedProcedure
    .input(z.object({
      description: z.string(),
      date: z.date(),
      amount: z.number(),
      categoryId: z.number().optional(),
      financialAccountId: z.number(),
      type: z.union([
        z.literal(TRANSACTION_TYPE.INCOME),
        z.literal(TRANSACTION_TYPE.EXPENSE),
      ]),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { description, date, amount, categoryId, financialAccountId, type } = input;

      const transaction = await db.transaction(async (tx) => {
        const transaction = await tx
          .insert(schema.transactions)
          .values({
            userId: ctx.session.user.id,
            categoryId: categoryId,
            financialAccountId,
            description,
            amount,
            date,
            type,
          })
          .returning();

        if (categoryId) {
          await tx
            .update(schema.categories)
            .set({
              budget: (type === TRANSACTION_TYPE.EXPENSE) ?
                decrement(schema.categories.budget, amount) :
                increment(schema.categories.budget, amount)
              ,
            })
            .where(eq(schema.categories.id, categoryId));
        }

        await tx
          .update(schema.financialAccounts)
          .set({
            balance: (type === TRANSACTION_TYPE.EXPENSE) ?
              decrement(schema.financialAccounts.balance, amount) :
              increment(schema.financialAccounts.balance, amount)
            ,
          })
          .where(eq(schema.financialAccounts.id, financialAccountId));

        return transaction;
      });

      return transaction;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      description: z.string(),
      date: z.date(),
      categoryId: z.coerce.number().nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, ...data } = input;

      const oldTransaction = await db
        .select()
        .from(schema.transactions)
        .where(and(
          eq(schema.transactions.id, id),
          eq(schema.transactions.userId, ctx.session.user.id),
        ))
        .get();

      if (!oldTransaction) {
        throw new Error("Transaction not found");
      }

      const transaction = await db.transaction(async (tx) => {
        const transaction = await tx
          .update(schema.transactions)
          .set({
            description: data.description,
            date: data.date,
            categoryId: data.categoryId ?? null,
          })
          .where(eq(schema.transactions.id, id))
          .returning()
          .get();

        if (oldTransaction.categoryId) {
          await tx
            .update(schema.categories)
            .set({
              budget: (oldTransaction.type === TRANSACTION_TYPE.EXPENSE) ?
                increment(schema.categories.budget, oldTransaction.amount) :
                decrement(schema.categories.budget, oldTransaction.amount)
              ,
            })
            .where(eq(schema.categories.id, oldTransaction.categoryId));
        }

        if (transaction.categoryId) {
          await tx
            .update(schema.categories)
            .set({
              budget: (transaction.type === TRANSACTION_TYPE.EXPENSE) ?
                decrement(schema.categories.budget, transaction.amount) :
                increment(schema.categories.budget, transaction.amount)
              ,
            })
            .where(eq(schema.categories.id, transaction.categoryId));
        }

        return transaction;
      });

      return transaction;
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      const transaction = await db
        .select()
        .from(schema.transactions)
        .where(and(
          eq(schema.transactions.id, id),
          eq(schema.transactions.userId, ctx.session.user.id),
        ))
        .get();

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      await db.transaction(async (tx) => {

        await tx
          .delete(schema.transactions)
          .where(eq(schema.transactions.id, id));

        await tx
          .update(schema.financialAccounts)
          .set({
            balance: (transaction.type === TRANSACTION_TYPE.EXPENSE) ?
              increment(schema.financialAccounts.balance, transaction.amount) :
              decrement(schema.financialAccounts.balance, transaction.amount)
            ,
          })
          .where(eq(schema.financialAccounts.id, transaction.financialAccountId));

        if (transaction.categoryId) {
          await tx
            .update(schema.categories)
            .set({
              budget: (transaction.type === TRANSACTION_TYPE.EXPENSE) ?
                increment(schema.categories.budget, transaction.amount) :
                decrement(schema.categories.budget, transaction.amount)
              ,
            })
            .where(eq(schema.categories.id, transaction.categoryId));
        }
      });

      return true;
    }),
});
