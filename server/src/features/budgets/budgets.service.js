import mongoose from "mongoose";

import Budget from "../../models/budget.model.js";
import Transaction from "../../models/transaction.model.js";
import ApiError from "../../utils/api-error.js";
import { getMonthDateRange, getMonthKey } from "../../utils/date.js";

export const setBudget = async (userId, payload) => {
  const { category, month, limit } = payload;

  if (!category || !limit) {
    throw new ApiError("Category and limit are required.", 400);
  }

  const numericLimit = Number(limit);

  if (Number.isNaN(numericLimit) || numericLimit <= 0) {
    throw new ApiError("Budget limit must be greater than zero.", 400);
  }

  const monthKey = month || getMonthKey();

  return Budget.findOneAndUpdate(
    { user: userId, category: category.trim(), month: monthKey },
    { limit: numericLimit },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );
};

export const getBudgets = async (userId, month) => {
  const monthKey = month || getMonthKey();
  const { start, end } = getMonthDateRange(monthKey);
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [budgets, spending] = await Promise.all([
    Budget.find({ user: userId, month: monthKey }).sort({ category: 1 }),
    Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          type: "expense",
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$category",
          spent: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  const spendingMap = new Map(spending.map((item) => [item._id, item.spent]));

  return budgets.map((budget) => {
    const spent = spendingMap.get(budget.category) || 0;

    return {
      id: budget._id,
      category: budget.category,
      month: budget.month,
      limit: budget.limit,
      spent,
      remaining: budget.limit - spent,
      percentageUsed: budget.limit > 0 ? Number(((spent / budget.limit) * 100).toFixed(2)) : 0,
    };
  });
};
