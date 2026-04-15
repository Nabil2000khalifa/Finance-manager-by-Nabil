import Account from "../../models/account.model.js";
import Budget from "../../models/budget.model.js";
import Notification from "../../models/notification.model.js";
import Transaction from "../../models/transaction.model.js";
import ApiError from "../../utils/api-error.js";
import { getMonthDateRange, getMonthKey } from "../../utils/date.js";

const applyBalanceChange = (account, type, amount) => {
  if (type === "income") {
    account.balance += amount;
  } else if (type === "expense") {
    account.balance -= amount;
  }
};

const revertBalanceChange = (account, type, amount) => {
  if (type === "income") {
    account.balance -= amount;
  } else if (type === "expense") {
    account.balance += amount;
  }
};

const createBudgetAlertIfNeeded = async ({ userId, category, date }) => {
  const month = getMonthKey(date);
  const budget = await Budget.findOne({ user: userId, category, month });

  if (!budget) {
    return;
  }

  const { start, end } = getMonthDateRange(month);
  const [summary] = await Transaction.aggregate([
    {
      $match: {
        user: budget.user,
        type: "expense",
        category,
        date: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$amount" },
      },
    },
  ]);

  const totalSpent = summary?.totalSpent || 0;

  if (totalSpent > budget.limit) {
    await Notification.create({
      user: userId,
      title: "Budget exceeded",
      message: `Spending for ${category} has passed the ${month} budget limit.`,
      type: "warning",
    });
  }
};

export const addTransaction = async (userId, payload) => {
  const { accountId, type, amount, category, description, date } = payload;

  if (!accountId || !type || !amount || !category) {
    throw new ApiError("Account, type, amount, and category are required.", 400);
  }

  if (!["income", "expense"].includes(type)) {
    throw new ApiError("Only income and expense transactions can be added here.", 400);
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    throw new ApiError("Amount must be a valid number greater than zero.", 400);
  }

  const account = await Account.findOne({ _id: accountId, user: userId });

  if (!account) {
    throw new ApiError("Account not found.", 404);
  }

  applyBalanceChange(account, type, numericAmount);
  await account.save();

  const transaction = await Transaction.create({
    user: userId,
    account: account._id,
    type,
    amount: numericAmount,
    category: category.trim(),
    description: description?.trim() || "",
    date: date ? new Date(date) : new Date(),
  });

  if (type === "expense") {
    await createBudgetAlertIfNeeded({
      userId,
      category: category.trim(),
      date: date ? new Date(date) : new Date(),
    });
  }

  return Transaction.findById(transaction._id).populate("account transferAccount", "name type");
};

export const getTransactions = async (userId, filters) => {
  const query = { user: userId };

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.startDate || filters.endDate) {
    query.date = {};

    if (filters.startDate) {
      query.date.$gte = new Date(filters.startDate);
    }

    if (filters.endDate) {
      query.date.$lte = new Date(filters.endDate);
    }
  }

  return Transaction.find(query)
    .populate("account transferAccount", "name type")
    .sort({ date: -1, createdAt: -1 });
};

export const deleteTransaction = async (userId, transactionId) => {
  const transaction = await Transaction.findOne({ _id: transactionId, user: userId });

  if (!transaction) {
    throw new ApiError("Transaction not found.", 404);
  }

  if (transaction.type === "transfer") {
    const [fromAccount, toAccount] = await Promise.all([
      Account.findOne({ _id: transaction.account, user: userId }),
      Account.findOne({ _id: transaction.transferAccount, user: userId }),
    ]);

    if (!fromAccount || !toAccount) {
      throw new ApiError("Linked accounts for this transfer were not found.", 404);
    }

    fromAccount.balance += transaction.amount;
    toAccount.balance -= transaction.amount;

    await Promise.all([fromAccount.save(), toAccount.save()]);
  } else {
    const account = await Account.findOne({ _id: transaction.account, user: userId });

    if (!account) {
      throw new ApiError("Account not found for this transaction.", 404);
    }

    revertBalanceChange(account, transaction.type, transaction.amount);
    await account.save();
  }

  await transaction.deleteOne();

  return { message: "Transaction deleted successfully." };
};
