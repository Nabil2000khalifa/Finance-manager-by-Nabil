import asyncHandler from "../../utils/async-handler.js";
import { getBudgets, setBudget } from "./budgets.service.js";

export const createOrUpdateBudget = asyncHandler(async (req, res) => {
  const budget = await setBudget(req.user.id, req.body);
  res.status(201).json(budget);
});

export const listBudgets = asyncHandler(async (req, res) => {
  const budgets = await getBudgets(req.user.id, req.query.month);
  res.status(200).json(budgets);
});
