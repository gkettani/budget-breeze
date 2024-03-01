import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRANSACTION_TYPE } from "~/utils/enums";

export const transactionsRouter = createTRPCRouter({
  search: protectedProcedure
    .input(z.object({
      description: z.string().optional(),
      date: z.string().optional(),
      page: z.number().optional(),
      pageSize: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { description, date, page, pageSize } = input;
      const { db } = ctx;

      const where = {
        description: {
          contains: description ?? "",
        },
        date,
        userId: ctx.session.user.id,
      };

      const take = pageSize ?? 10;
      const skip = (page ?? 0) * take;

      const [transactions, count] = await Promise.all([
        db.transaction.findMany({
          where,
          take,
          skip,
          orderBy: { date: "desc" },
        }),
        db.transaction.count({ where }),
      ]);

      return {
        transactions,
        count,
      };
    }),

  list: protectedProcedure
    .query(async ({ ctx }) => {
      const { db } = ctx;

      const transactions = await db.transaction.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: { date: "desc" },
        include: {
          category: true,
          financialAccount: true,
        },
      });

      return transactions;
    }),

  create: protectedProcedure
    .input(z.object({
      description: z.string(),
      date: z.date(),
      amount: z.number(),
      categoryId: z.string().optional(),
      financialAccountId: z.string(),
      type: z.union([
        z.literal(TRANSACTION_TYPE.INCOME),
        z.literal(TRANSACTION_TYPE.EXPENSE),
      ]),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { description, date, amount, categoryId, financialAccountId, type } = input;

      const transaction = await db.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
          data: {
            description,
            date,
            type,
            amount,
            categoryId,
            userId: ctx.session.user.id,
            financialAccountId,
          },
        });

        if (categoryId) {
          await tx.category.update({
            where: { id: categoryId },
            data: {
              budget: (type === TRANSACTION_TYPE.EXPENSE) ? {
                decrement: amount,
              } : {
                increment: amount,
              },
            },
          });
        }

        await tx.financialAccount.update({
          where: { id: financialAccountId },
          data: {
            balance: (type === TRANSACTION_TYPE.EXPENSE) ? {
              decrement: amount,
            } : {
              increment: amount,
            },
          },
        });

        return transaction;
      });

      return transaction;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      description: z.string(),
      date: z.date(),
      categoryId: z.string().nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, ...data } = input;

      const oldTransaction = await db.transaction.findUnique({
        where: { id },
      });

      if (!oldTransaction) {
        throw new Error("Transaction not found");
      }

      const transaction = await db.$transaction(async (tx) => {
        const transaction = await tx.transaction.update({
          where: { id },
          data,
        });

        if (oldTransaction.categoryId) {
          await tx.category.update({
            where: { id: oldTransaction.categoryId },
            data: {
              budget: (oldTransaction.type === TRANSACTION_TYPE.EXPENSE) ? {
                increment: oldTransaction.amount,
              } : {
                decrement: oldTransaction.amount,
              },
            },
          });
        }

        if (transaction.categoryId) {
          await tx.category.update({
            where: { id: transaction.categoryId },
            data: {
              budget: (transaction.type === TRANSACTION_TYPE.EXPENSE) ? {
                decrement: transaction.amount,
              } : {
                increment: transaction.amount,
              },
            },
          });
        }

        return transaction;
      });

      return transaction;
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      const transaction = await db.transaction.findUnique({
        where: { id },
      });

      if (!transaction) {
        throw new Error("Transaction not found");
      }

      await db.$transaction(async (tx) => {

        await tx.transaction.delete({
          where: { id },
        });

        await tx.financialAccount.update({
          where: { id: transaction.financialAccountId },
          data: {
            balance: (transaction.type === TRANSACTION_TYPE.EXPENSE) ? {
              increment: transaction.amount,
            } : {
              decrement: transaction.amount,
            },
          },
        });

        if (transaction.categoryId) {
          await tx.category.update({
            where: { id: transaction.categoryId },
            data: {
              budget: (transaction.type === TRANSACTION_TYPE.EXPENSE) ? {
                increment: transaction.amount,
              } : {
                decrement: transaction.amount,
              },
            },
          });
        }
      });

      return true;
    }),
});
