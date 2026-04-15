import asyncHandler from "../../utils/async-handler.js";
import { addBill, getBills } from "./bills.service.js";

export const createBill = asyncHandler(async (req, res) => {
  const bill = await addBill(req.user.id, req.body);
  res.status(201).json(bill);
});

export const listBills = asyncHandler(async (req, res) => {
  const bills = await getBills(req.user.id);
  res.status(200).json(bills);
});
