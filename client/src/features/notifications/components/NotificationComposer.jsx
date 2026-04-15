import { useState } from "react";

const NotificationComposer = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
    setFormData({ title: "", message: "", type: "info" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field full-width">
          <label htmlFor="notification-title">Title</label>
          <input
            id="notification-title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Reminder"
            required
          />
        </div>

        <div className="field full-width">
          <label htmlFor="notification-message">Message</label>
          <textarea
            id="notification-message"
            name="message"
            rows="3"
            value={formData.message}
            onChange={handleChange}
            placeholder="This is a custom notification."
            required
          />
        </div>

        <div className="field full-width">
          <label htmlFor="notification-type">Type</label>
          <select id="notification-type" name="type" value={formData.type} onChange={handleChange}>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
          </select>
        </div>
      </div>

      <div className="button-row">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Create notification"}
        </button>
      </div>
    </form>
  );
};

export default NotificationComposer;
