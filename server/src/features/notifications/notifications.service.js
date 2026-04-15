import Notification from "../../models/notification.model.js";
import ApiError from "../../utils/api-error.js";

export const createNotification = async (userId, payload) => {
  const { title, message, type } = payload;

  if (!title || !message) {
    throw new ApiError("Title and message are required.", 400);
  }

  return Notification.create({
    user: userId,
    title: title.trim(),
    message: message.trim(),
    type: type || "info",
  });
};

export const getNotifications = async (userId) =>
  Notification.find({ user: userId }).sort({ createdAt: -1 });

export const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError("Notification not found.", 404);
  }

  return notification;
};
