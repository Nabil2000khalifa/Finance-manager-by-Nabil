import { useEffect, useState } from "react";

import { getTodayValue, transactionCategories } from "../../../utils/constants.js";

const TransactionForm = ({ accounts, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    accountId: "",
    type: "expense",
    amount: "",
    category: "",
    description: "",
    date: getTodayValue(),
  });

  useEffect(() => {
    if (accounts.length && !formData.accountId) {
      setFormData((current) => ({ ...current, accountId: accounts[0]._id }));
    }
  }, [accounts]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
    setFormData((current) => ({
      ...current,
      amount: "",
      category: "",
      description: "",
      accountId: accounts[0]?._id || "",
    }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="accountId">Account</label>
          <select
            id="accountId"
            name="accountId"
            value={formData.accountId}
            onChange={handleChange}
            required
          >
            <option value="">Select an account</option>
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.name} ({account.type})
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="type">Type</label>
          <select id="type" name="type" value={formData.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            name="category"
            list="transaction-categories"
            placeholder="Groceries"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <datalist id="transaction-categories">
            {transactionCategories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>

        <div className="field">
          <label htmlFor="date">Date</label>
          <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} />
        </div>

        <div className="field full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            placeholder="Optional notes"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="button-row">
        <button type="submit" className="primary-button" disabled={isSubmitting || !accounts.length}>
          {isSubmitting ? "Saving..." : "Add transaction"}
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
