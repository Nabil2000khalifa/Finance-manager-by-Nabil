import asyncHandler from "../../utils/async-handler.js";
import { getProfile, updateCurrency, updateProfile } from "./settings.service.js";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await getProfile(req.user.id);
  res.status(200).json(user);
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user.id, req.body);
  res.status(200).json(user);
});

export const updateUserCurrency = asyncHandler(async (req, res) => {
  const user = await updateCurrency(req.user.id, req.body);
  res.status(200).json(user);
});
