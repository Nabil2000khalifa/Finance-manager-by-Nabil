import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";

export const protect = async (req, _res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new ApiError("Access denied. Please log in first.", 401);
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new ApiError("User not found for this token.", 401);
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      currency: user.currency,
    };

    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError("Invalid or expired token.", 401));
  }
};
