import mongoose from "mongoose";

import Account from "../../models/account.model.js";
import Transaction from "../../models/transaction.model.js";

export const getDashboardSummary = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [accounts, totals, recentTransactions] = await Promise.all([
    Account.find({ user: userId }).sort({ createdAt: -1 }),
    Transaction.aggregate([
      {
        $match: {
          user: userObjectId,
          type: { $in: ["income", "expense"] },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]),
    Transaction.find({ user: userId })
      .populate("account transferAccount", "name type")
      .sort({ date: -1, createdAt: -1 })
      .limit(5),
  ]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalIncome = totals.find((item) => item._id === "income")?.total || 0;
  const totalExpense = totals.find((item) => item._id === "expense")?.total || 0;

  return {
    totalBalance,
    totalIncome,
    totalExpense,
    recentTransactions,
  };
};
