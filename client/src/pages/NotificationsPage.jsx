import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader.jsx";
import SectionCard from "../components/SectionCard.jsx";
import NotificationComposer from "../features/notifications/components/NotificationComposer.jsx";
import NotificationList from "../features/notifications/components/NotificationList.jsx";
import { notificationsService } from "../features/notifications/notifications.service.js";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadNotifications = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await notificationsService.getNotifications();
      setNotifications(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleCreateNotification = async (payload) => {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      await notificationsService.createNotification(payload);
      setMessage("Notification created successfully.");
      await loadNotifications();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    setError("");

    try {
      await notificationsService.markAsRead(notificationId);
      await loadNotifications();
    } catch (readError) {
      setError(readError.message);
    }
  };

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Review automatic alerts and create your own reminders when needed."
      />

      {message ? <div className="message-banner success">{message}</div> : null}
      {error ? <div className="message-banner error">{error}</div> : null}

      <div className="grid-two">
        <SectionCard
          title="Create a custom alert"
          description="This is useful for manual reminders that do not come from bills or budgets."
        >
          <NotificationComposer onSubmit={handleCreateNotification} isSubmitting={isSaving} />
        </SectionCard>

        <SectionCard
          title="Inbox"
          description="Unread items can be marked as read after you have handled them."
        >
          {isLoading ? (
            <p className="muted-text">Loading notifications...</p>
          ) : (
            <NotificationList notifications={notifications} onMarkAsRead={handleMarkAsRead} />
          )}
        </SectionCard>
      </div>
    </>
  );
};

export default NotificationsPage;
