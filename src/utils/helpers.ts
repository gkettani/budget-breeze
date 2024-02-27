export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount / 100);
}

export function amountToCents(amount: number) {
  return amount * 100;
}

export function centsToAmount(amountInCents: number) {
  return amountInCents / 100;
}
