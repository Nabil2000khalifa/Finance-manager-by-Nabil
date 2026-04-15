import { useState } from "react";

import { billFrequencies, getTodayValue } from "../../../utils/constants.js";

const BillForm = ({ accounts, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: getTodayValue(),
    frequency: "monthly",
    accountId: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
    setFormData((current) => ({
      ...current,
      name: "",
      amount: "",
      accountId: "",
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="bill-name">Bill name</label>
          <input
            id="bill-name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Internet bill"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="bill-amount">Amount</label>
          <input
            id="bill-amount"
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="bill-due-date">Due date</label>
          <input
            id="bill-due-date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="bill-frequency">Frequency</label>
          <select
            id="bill-frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
          >
            {billFrequencies.map((frequency) => (
              <option key={frequency} value={frequency}>
                {frequency}
              </option>
            ))}
          </select>
        </div>

        <div className="field full-width">
          <label htmlFor="bill-account">Pay from account</label>
          <select id="bill-account" name="accountId" value={formData.accountId} onChange={handleChange}>
            <option value="">No linked account</option>
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="button-row">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Add recurring bill"}
        </button>
      </div>
    </form>
  );
};

export default BillForm;
