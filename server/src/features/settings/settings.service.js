import User from "../../models/user.model.js";
import ApiError from "../../utils/api-error.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  currency: user.currency,
  createdAt: user.createdAt,
});

export const getProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError("User not found.", 404);
  }

  return sanitizeUser(user);
};

export const updateProfile = async (userId, payload) => {
  const { name, email } = payload;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError("User not found.", 404);
  }

  if (email && email.trim().toLowerCase() !== user.email) {
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (existingUser) {
      throw new ApiError("This email is already in use.", 409);
    }
  }

  user.name = name?.trim() || user.name;
  user.email = email?.trim().toLowerCase() || user.email;
  await user.save();

  return sanitizeUser(user);
};

export const updateCurrency = async (userId, payload) => {
  const { currency } = payload;

  if (!currency) {
    throw new ApiError("Currency is required.", 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError("User not found.", 404);
  }

  user.currency = currency.trim().toUpperCase();
  await user.save();

  return sanitizeUser(user);
};
