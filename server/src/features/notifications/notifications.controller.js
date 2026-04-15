import asyncHandler from "../../utils/async-handler.js";
import {
  createNotification,
  getNotifications,
  markAsRead,
} from "./notifications.service.js";

export const createUserNotification = asyncHandler(async (req, res) => {
  const notification = await createNotification(req.user.id, req.body);
  res.status(201).json(notification);
});

export const listNotifications = asyncHandler(async (req, res) => {
  const notifications = await getNotifications(req.user.id);
  res.status(200).json(notifications);
});

export const updateNotification = asyncHandler(async (req, res) => {
  const notification = await markAsRead(req.user.id, req.params.id);
  res.status(200).json(notification);
});
