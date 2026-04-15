import asyncHandler from "../../utils/async-handler.js";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
} from "./transactions.service.js";

export const createTransaction = asyncHandler(async (req, res) => {
  const transaction = await addTransaction(req.user.id, req.body);
  res.status(201).json(transaction);
});

export const listTransactions = asyncHandler(async (req, res) => {
  const transactions = await getTransactions(req.user.id, req.query);
  res.status(200).json(transactions);
});

export const removeTransaction = asyncHandler(async (req, res) => {
  const result = await deleteTransaction(req.user.id, req.params.id);
  res.status(200).json(result);
});
