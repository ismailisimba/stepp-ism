export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export function formatNumber(value: number, decimals : number, options = {}) {
  return value.toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: decimals,
    maximumFractionDigits: 2,
    ...options,
  });
}
