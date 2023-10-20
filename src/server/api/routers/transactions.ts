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
        include: { category: true },
      });

      return transactions;
    }),

  create: protectedProcedure
    .input(z.object({
      description: z.string(),
      date: z.date(),
      amount: z.number(),
      categoryId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { description, date, amount, categoryId } = input;

      const transaction = await db.transaction.create({
        data: {
          description,
          date,
          amount,
          categoryId,
          userId: ctx.session.user.id,
        },
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

      const transaction = await db.transaction.update({
        where: { id },
        data,
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

      await db.transaction.delete({
        where: { id },
      });

      return true;
    }),
});
