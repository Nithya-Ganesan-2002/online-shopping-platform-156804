export function formatCurrency(value: number, currency = "USD", locale = "en-US") {
  try {
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
      value
    );
  } catch {
    return `$${value.toFixed(2)}`;
  }
}
