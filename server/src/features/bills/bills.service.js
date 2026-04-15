import Account from "../../models/account.model.js";
import Bill from "../../models/bill.model.js";
import Notification from "../../models/notification.model.js";
import ApiError from "../../utils/api-error.js";

const dayInMilliseconds = 24 * 60 * 60 * 1000;

const getBillStatus = (dueDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / dayInMilliseconds);

  if (daysUntilDue < 0) {
    return { daysUntilDue, status: "overdue" };
  }

  if (daysUntilDue === 0) {
    return { daysUntilDue, status: "due today" };
  }

  if (daysUntilDue <= 7) {
    return { daysUntilDue, status: "due soon" };
  }

  return { daysUntilDue, status: "upcoming" };
};

export const addBill = async (userId, payload) => {
  const { accountId, name, amount, dueDate, frequency } = payload;

  if (!name || !amount || !dueDate) {
    throw new ApiError("Name, amount, and due date are required.", 400);
  }

  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount) || numericAmount <= 0) {
    throw new ApiError("Bill amount must be greater than zero.", 400);
  }

  let account = null;

  if (accountId) {
    account = await Account.findOne({ _id: accountId, user: userId });

    if (!account) {
      throw new ApiError("Account not found.", 404);
    }
  }

  const bill = await Bill.create({
    user: userId,
    account: account?._id || null,
    name: name.trim(),
    amount: numericAmount,
    dueDate: new Date(dueDate),
    frequency: frequency || "monthly",
  });

  const tracking = getBillStatus(bill.dueDate);

  if (tracking.status === "due soon" || tracking.status === "due today" || tracking.status === "overdue") {
    await Notification.create({
      user: userId,
      title: "Bill reminder",
      message: `${bill.name} is ${tracking.status}.`,
      type: tracking.status === "overdue" ? "warning" : "info",
    });
  }

  return Bill.findById(bill._id).populate("account", "name type");
};

export const getBills = async (userId) => {
  const bills = await Bill.find({ user: userId }).populate("account", "name type").sort({ dueDate: 1 });

  return bills.map((bill) => {
    const tracking = getBillStatus(bill.dueDate);

    return {
      id: bill._id,
      name: bill.name,
      amount: bill.amount,
      dueDate: bill.dueDate,
      frequency: bill.frequency,
      isActive: bill.isActive,
      account: bill.account,
      daysUntilDue: tracking.daysUntilDue,
      status: tracking.status,
    };
  });
};
