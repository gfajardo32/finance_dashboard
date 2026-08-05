export function formatCurrency(value, currency = "HNL") {
  const locale = currency === "USD" ? "en-US" : "es-HN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(Number(value));
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("es-HN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
