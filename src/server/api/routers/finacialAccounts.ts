import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const financialAccountsRouter = createTRPCRouter({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      const { db } = ctx;

      const accounts = await db.financialAccount.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: { name: "asc" },
      });

      return accounts;
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      balance: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;

      const account = await db.financialAccount.create({
        data: {
          name: input.name,
          balance: input.balance,
          userId: ctx.session.user.id,
        },
      });

      return account;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      balance: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, name, balance } = input;

      const account = await db.financialAccount.update({
        where: { id },
        data: {
          name,
          balance,
        },
      });

      return account;
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id } = input;

      const account = await db.financialAccount.delete({
        where: { id },
      });

      return account;
    }),
});
