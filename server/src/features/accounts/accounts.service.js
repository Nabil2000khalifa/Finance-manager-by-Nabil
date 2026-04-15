import Account from "../../models/account.model.js";
import Notification from "../../models/notification.model.js";
import Transaction from "../../models/transaction.model.js";
import ApiError from "../../utils/api-error.js";

export const createAccount = async (userId, payload) => {
  const { name, type, balance } = payload;

  if (!name || !type) {
    throw new ApiError("Account name and type are required.", 400);
  }

  if (!["cash", "bank"].includes(type)) {
    throw new ApiError("Account type must be cash or bank.", 400);
  }

  const numericBalance = balance ? Number(balance) : 0;

  if (Number.isNaN(numericBalance)) {
    throw new ApiError("Opening balance must be a valid number.", 400);
  }

  return Account.create({
    user: userId,
    name: name.trim(),
    type,
    balance: numericBalance,
  });
};

export const getAccounts = async (userId) =>
  Account.find({ user: userId }).sort({ createdAt: -1 });

export const transferBetweenAccounts = async (userId, payload) => {
  const { fromAccountId, toAccountId, amount, description, date } = payload;

  if (!fromAccountId || !toAccountId || !amount) {
    throw new ApiError("From account, to account, and amount are required.", 400);
  }

  if (fromAccountId === toAccountId) {
    throw new ApiError("Transfer accounts must be different.", 400);
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    throw new ApiError("Transfer amount must be greater than zero.", 400);
  }

  const [fromAccount, toAccount] = await Promise.all([
    Account.findOne({ _id: fromAccountId, user: userId }),
    Account.findOne({ _id: toAccountId, user: userId }),
  ]);

  if (!fromAccount || !toAccount) {
    throw new ApiError("One or both accounts were not found.", 404);
  }

  if (fromAccount.balance < numericAmount) {
    throw new ApiError("Not enough balance in the source account.", 400);
  }

  fromAccount.balance -= numericAmount;
  toAccount.balance += numericAmount;

  await Promise.all([fromAccount.save(), toAccount.save()]);

  const transfer = await Transaction.create({
    user: userId,
    account: fromAccount._id,
    transferAccount: toAccount._id,
    type: "transfer",
    amount: numericAmount,
    category: "Transfer",
    description: description?.trim() || "",
    date: date ? new Date(date) : new Date(),
  });

  await Notification.create({
    user: userId,
    title: "Transfer completed",
    message: `${numericAmount} moved from ${fromAccount.name} to ${toAccount.name}.`,
    type: "success",
  });

  return Transaction.findById(transfer._id).populate("account transferAccount", "name type");
};
