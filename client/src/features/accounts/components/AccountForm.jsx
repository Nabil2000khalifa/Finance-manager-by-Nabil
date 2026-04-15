import { useState } from "react";

import { accountTypes } from "../../../utils/constants.js";

const AccountForm = ({ onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "cash",
    balance: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
    setFormData({ name: "", type: "cash", balance: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="account-name">Account name</label>
          <input
            id="account-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Savings Account"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="account-type">Type</label>
          <select id="account-type" name="type" value={formData.type} onChange={handleChange}>
            {accountTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="field full-width">
          <label htmlFor="account-balance">Opening balance</label>
          <input
            id="account-balance"
            name="balance"
            type="number"
            step="0.01"
            value={formData.balance}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>
      </div>

      <div className="button-row">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Create account"}
        </button>
      </div>
    </form>
  );
};

export default AccountForm;
