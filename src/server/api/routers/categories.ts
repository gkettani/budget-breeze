import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRANSACTION_TYPE } from "~/utils/enums";

export const categoriesRouter = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const { db } = ctx;

      const categories = await db.category.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: { name: "asc" },
      });

      // get current month's transactions
      const transactions = await db.transaction.findMany({
        where: {
          userId: ctx.session.user.id,
          date: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
          type: TRANSACTION_TYPE.EXPENSE,
        },
      });

      return categories.map((category) => {
        const total = transactions
          .filter((transaction) => transaction.categoryId === category.id)
          .reduce((acc, transaction) => acc + transaction.amount, 0);

        return {
          ...category,
          monthExpenseTotal: total,
          monthExpensePercentage: category.target ? total*100 / category.target : 0,
        };
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const category = await db.category.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });

      return category;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      budget: z.number().optional(),
      target: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, name, budget, target } = input;

      const category = await db.category.update({
        where: { id },
        data: {
          name,
          budget,
          target,
        },
      });

      return category;
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      const category = await db.category.delete({
        where: { id },
      });

      return category;
    }),
});
