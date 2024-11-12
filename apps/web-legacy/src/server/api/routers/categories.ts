import { z } from "zod";
import { schema, eq, gte, and } from '~/db';
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRANSACTION_TYPE } from "~/utils/enums";

export const categoriesRouter = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const { db } = ctx;

      const categories = await db
        .select()
        .from(schema.categories)
        .where(eq(schema.categories.userId, ctx.session.user.id))
        .orderBy(schema.categories.name);

      // get current month's transactions
      const transactions = await db
        .select()
        .from(schema.transactions)
        .where(
          and(
            eq(schema.transactions.userId, ctx.session.user.id),
            eq(schema.transactions.type, TRANSACTION_TYPE.EXPENSE),
            gte(schema.transactions.date, new Date(new Date().getFullYear(), new Date().getMonth(), 1)), // TODO: fix date handling (set to UTC)
          ),
        );

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

      const category = await db
        .insert(schema.categories)
        .values({
          name: input.name,
          userId: ctx.session.user.id,
        })
        .returning();

      return category;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      budget: z.number().optional(),
      target: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, name, budget, target } = input;

      const category = await db
        .update(schema.categories)
        .set({
          name,
          budget,
          target,
        })
        .where(and(
          eq(schema.categories.id, id),
          eq(schema.categories.userId, ctx.session.user.id),
        ))
        .returning();

      return category;
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      const category = await db
        .delete(schema.categories)
        .where(and(
          eq(schema.categories.id, id),
          eq(schema.categories.userId, ctx.session.user.id),
        ))
        .returning();

      return category;
    }),
});
