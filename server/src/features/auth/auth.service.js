import bcrypt from "bcrypt";

import Account from "../../models/account.model.js";
import Notification from "../../models/notification.model.js";
import User from "../../models/user.model.js";
import ApiError from "../../utils/api-error.js";
import { generateToken } from "../../utils/jwt.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  currency: user.currency,
  createdAt: user.createdAt,
});

export const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new ApiError("Name, email, and password are required.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError("An account with this email already exists.", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  await Account.create({
    user: user._id,
    name: "Main Cash",
    type: "cash",
    balance: 0,
  });

  await Notification.create({
    user: user._id,
    title: "Welcome",
    message: "Your finance manager account is ready to use.",
    type: "success",
  });

  const freshUser = await User.findById(user._id);

  return {
    token: generateToken(user._id),
    user: sanitizeUser(freshUser),
  };
};

export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError("Email and password are required.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw new ApiError("Invalid email or password.", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new ApiError("Invalid email or password.", 401);
  }

  const freshUser = await User.findById(user._id);

  return {
    token: generateToken(user._id),
    user: sanitizeUser(freshUser),
  };
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError("User not found.", 404);
  }

  return sanitizeUser(user);
};
