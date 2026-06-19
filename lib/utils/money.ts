/**
 * Brand-locked price format: "PKR 12,500" — currency code, space,
 * integer amount with comma thousands separators.
 */
export function formatMoney(amount: string, currencyCode: string) {
  const value = Number(amount);
  if (!Number.isFinite(value)) return `${currencyCode} ${amount}`;

  return `${currencyCode} ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}
