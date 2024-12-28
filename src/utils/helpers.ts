export function formatCurrency(amount: number, compact = false) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: compact ? 0 : 2,
    notation: compact ? "compact" : "standard",
  }).format(amount / 100);
}

export function amountToCents(amount: number) {
  return Math.round(amount * 100);
}

export function centsToAmount(amountInCents: number) {
  return parseFloat((amountInCents / 100).toFixed(2));
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
  }).format(value);
}

export const FLOAT_REGEX = /^-?\d+([.]\d{1,2})?$/;
export const POSITIVE_FLOAT_REGEX = /^\d+([.]\d{1,2})?$/;
