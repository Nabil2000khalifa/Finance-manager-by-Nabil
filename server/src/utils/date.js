export const getMonthKey = (value = new Date()) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const getMonthDateRange = (month) => {
  const [year, monthValue] = month.split("-").map(Number);
  const start = new Date(year, monthValue - 1, 1);
  const end = new Date(year, monthValue, 1);

  return { start, end };
};
