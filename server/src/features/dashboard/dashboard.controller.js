import asyncHandler from "../../utils/async-handler.js";
import { getDashboardSummary } from "./dashboard.service.js";

export const getSummary = asyncHandler(async (req, res) => {
  const summary = await getDashboardSummary(req.user.id);
  res.status(200).json(summary);
});
