import { z } from "zod";
import { schema, eq, and } from '~/db';
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { FINANCIAL_ACCOUNT_TYPE } from "~/utils/enums";

export const financialAccountsRouter = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const { db } = ctx;

      const accounts = await db
        .select()
        .from(schema.financialAccounts)
        .where(eq(schema.financialAccounts.userId, ctx.session.user.id))
        .orderBy(schema.financialAccounts.name);

      return accounts;
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      balance: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const account = await db
        .insert(schema.financialAccounts)
        .values({
          name: input.name,
          balance: input.balance,
          userId: ctx.session.user.id,
        })
        .returning();

      return account;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      balance: z.number().optional(),
      type: z.union([
        z.literal(FINANCIAL_ACCOUNT_TYPE.PAYMENT),
        z.literal(FINANCIAL_ACCOUNT_TYPE.SAVINGS),
      ]).optional(),
      archived: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, name, balance, type, archived } = input;

      const account = await db
        .update(schema.financialAccounts)
        .set({
          name,
          balance,
          type,
          archived,
        })
        .where(and(
          eq(schema.financialAccounts.id, id),
          eq(schema.financialAccounts.userId, ctx.session.user.id),
        ))
        .returning();

      return account;
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      const account = await db
        .delete(schema.financialAccounts)
        .where(and(
          eq(schema.financialAccounts.id, id),
          eq(schema.financialAccounts.userId, ctx.session.user.id),
        ))
        .returning();

      return account;
    }),
});
