import EmptyState from "../../../components/EmptyState.jsx";
import { formatDate } from "../../../utils/formatters.js";

const NotificationList = ({ notifications, onMarkAsRead }) => {
  if (!notifications.length) {
    return (
      <EmptyState
        title="No notifications yet"
        description="Budget alerts, bill reminders, and custom updates will appear here."
      />
    );
  }

  return (
    <div className="stack-list">
      {notifications.map((notification) => (
        <div key={notification._id} className="notification-row">
          <div>
            <strong>{notification.title}</strong>
            <p className="meta-text">{notification.message}</p>
            <p className="meta-text">{formatDate(notification.createdAt)}</p>
          </div>

          <div className="button-row">
            <span className="status-chip">{notification.isRead ? "Read" : "Unread"}</span>
            {!notification.isRead ? (
              <button
                type="button"
                className="secondary-button"
                onClick={() => onMarkAsRead(notification._id)}
              >
                Mark as read
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
