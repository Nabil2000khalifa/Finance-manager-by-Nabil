export const transactionCategories = [
  "Salary",
  "Freelance",
  "Groceries",
  "Rent",
  "Utilities",
  "Travel",
  "Shopping",
  "Health",
  "Entertainment",
  "Savings",
];

export const accountTypes = ["cash", "bank"];

export const billFrequencies = ["weekly", "monthly", "yearly"];

export const currencyOptions = ["USD", "EUR", "GBP", "INR", "CAD", "AUD"];

export const getTodayValue = () => new Date().toISOString().slice(0, 10);

export const getCurrentMonthValue = () => new Date().toISOString().slice(0, 7);
