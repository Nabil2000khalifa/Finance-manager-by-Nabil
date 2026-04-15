import asyncHandler from "../../utils/async-handler.js";
import { getCurrentUser, loginUser, registerUser } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const data = await registerUser(req.body);
  res.status(201).json(data);
});

export const login = asyncHandler(async (req, res) => {
  const data = await loginUser(req.body);
  res.status(200).json(data);
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  res.status(200).json(user);
});
