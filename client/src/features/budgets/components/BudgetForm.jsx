import { useEffect, useState } from "react";

import { getCurrentMonthValue, transactionCategories } from "../../../utils/constants.js";

const BudgetForm = ({ onSubmit, isSubmitting, defaultMonth = getCurrentMonthValue() }) => {
  const [formData, setFormData] = useState({
    category: "",
    month: defaultMonth,
    limit: "",
  });

  useEffect(() => {
    setFormData((current) => ({ ...current, month: defaultMonth }));
  }, [defaultMonth]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);
    setFormData((current) => ({ ...current, category: "", limit: "" }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="budget-category">Category</label>
          <input
            id="budget-category"
            name="category"
            list="budget-categories"
            value={formData.category}
            onChange={handleChange}
            placeholder="Groceries"
            required
          />
          <datalist id="budget-categories">
            {transactionCategories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </div>

        <div className="field">
          <label htmlFor="budget-month">Month</label>
          <input
            id="budget-month"
            name="month"
            type="month"
            value={formData.month}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field full-width">
          <label htmlFor="budget-limit">Budget limit</label>
          <input
            id="budget-limit"
            name="limit"
            type="number"
            min="0.01"
            step="0.01"
            value={formData.limit}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="button-row">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save budget"}
        </button>
      </div>
    </form>
  );
};

export default BudgetForm;
