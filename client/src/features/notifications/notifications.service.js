import api, { requestData } from "../../services/api.js";

export const notificationsService = {
  getNotifications: () => requestData(api.get("/notifications")),
  createNotification: (payload) => requestData(api.post("/notifications", payload)),
  markAsRead: (notificationId) => requestData(api.patch(`/notifications/${notificationId}/read`)),
};
