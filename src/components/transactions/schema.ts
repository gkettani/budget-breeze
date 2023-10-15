import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string(),
  description: z.string(),
  amount: z.number(),
  date: z.date(),
});

export type Transaction = z.infer<typeof transactionSchema>
