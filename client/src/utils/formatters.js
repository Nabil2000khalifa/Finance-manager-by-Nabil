export const formatCurrency = (value, currency = "USD") => {
  const numericValue = Number(value) || 0;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numericValue);
  } catch {
    return `${currency} ${numericValue.toFixed(2)}`;
  }
};

export const formatDate = (value) => {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatSignedAmount = (amount, type, currency) => {
  const prefix = type === "expense" ? "-" : "+";
  return `${prefix}${formatCurrency(Math.abs(amount), currency)}`;
};

export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong. Please try again.";
