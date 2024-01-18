import type { Prisma } from "@prisma/client";

export function formatCurrency(amount: number | Prisma.Decimal) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(Number(amount));
}
