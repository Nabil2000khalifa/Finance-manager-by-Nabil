import { useEffect, useState } from "react";

const ProfileForm = ({ user, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  useEffect(() => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="settings-name">Name</label>
          <input id="settings-name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="field">
          <label htmlFor="settings-email">Email</label>
          <input
            id="settings-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="button-row">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update profile"}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
