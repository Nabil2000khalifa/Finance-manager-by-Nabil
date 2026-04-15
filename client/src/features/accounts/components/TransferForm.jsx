import { useState } from "react";

import { getTodayValue } from "../../../utils/constants.js";

const TransferForm = ({ accounts, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    description: "",
    date: getTodayValue(),
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
      fromAccountId: "",
      toAccountId: "",
      amount: "",
      description: "",
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="from-account">From account</label>
          <select
            id="from-account"
            name="fromAccountId"
            value={formData.fromAccountId}
            onChange={handleChange}
            required
          >
            <option value="">Select source account</option>
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="to-account">To account</label>
          <select
            id="to-account"
            name="toAccountId"
            value={formData.toAccountId}
            onChange={handleChange}
            required
          >
            <option value="">Select destination account</option>
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="transfer-amount">Amount</label>
          <input
            id="transfer-amount"
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
          <label htmlFor="transfer-date">Date</label>
          <input
            id="transfer-date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <div className="field full-width">
          <label htmlFor="transfer-description">Description</label>
          <input
            id="transfer-description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Move emergency funds"
          />
        </div>
      </div>

      <div className="button-row">
        <button type="submit" className="primary-button" disabled={isSubmitting || accounts.length < 2}>
          {isSubmitting ? "Moving..." : "Transfer funds"}
        </button>
      </div>
    </form>
  );
};

export default TransferForm;
