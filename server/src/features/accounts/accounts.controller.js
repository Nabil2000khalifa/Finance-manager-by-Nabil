import asyncHandler from "../../utils/async-handler.js";
import {
  createAccount,
  getAccounts,
  transferBetweenAccounts,
} from "./accounts.service.js";

export const addAccount = asyncHandler(async (req, res) => {
  const account = await createAccount(req.user.id, req.body);
  res.status(201).json(account);
});

export const listAccounts = asyncHandler(async (req, res) => {
  const accounts = await getAccounts(req.user.id);
  res.status(200).json(accounts);
});

export const transferFunds = asyncHandler(async (req, res) => {
  const transfer = await transferBetweenAccounts(req.user.id, req.body);
  res.status(201).json(transfer);
});
