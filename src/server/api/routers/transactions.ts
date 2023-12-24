import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { description, date, amount, categoryId, financialAccountId } = input;

      const transaction = await db.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
          data: {
            description,
            date,
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
              budget: {
                increment: amount,
              },
            },
          });
        }

        await tx.financialAccount.update({
          where: { id: financialAccountId },
          data: {
            balance: {
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
      amount: z.number(),
      categoryId: z.string().optional(),
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

      const amountDiff = data.amount - oldTransaction.amount;

      const transaction = await db.$transaction(async (tx) => {
        const transaction = await tx.transaction.update({
          where: { id },
          data: {
            ...data,
          },
        });

        if (amountDiff !== 0) {
          await tx.financialAccount.update({
            where: { id: transaction.financialAccountId },
            data: {
              balance: {
                increment: amountDiff,
              },
            },
          });
          if (oldTransaction.categoryId) {
            await tx.category.update({
              where: { id: oldTransaction.categoryId },
              data: {
                budget: {
                  increment: amountDiff,
                },
              },
            });
          }
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
            balance: {
              decrement: transaction.amount,
            },
          },
        });

        if (transaction.categoryId) {
          await tx.category.update({
            where: { id: transaction.categoryId },
            data: {
              budget: {
                decrement: transaction.amount,
              },
            },
          });
        }
      });

      return true;
    }),
});
