import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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

      return categories;
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
      name: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, name } = input;

      const category = await db.category.update({
        where: { id },
        data: { name },
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
