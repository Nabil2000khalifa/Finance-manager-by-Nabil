import { useEffect, useState } from "react";

import { currencyOptions } from "../../../utils/constants.js";

const CurrencyForm = ({ currentCurrency, onSubmit, isSubmitting }) => {
  const [currency, setCurrency] = useState(currentCurrency || "USD");

  useEffect(() => {
    setCurrency(currentCurrency || "USD");
  }, [currentCurrency]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({ currency });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field full-width">
        <label htmlFor="settings-currency">Preferred currency</label>
        <select
          id="settings-currency"
          name="currency"
          value={currency}
          onChange={(event) => setCurrency(event.target.value)}
        >
          {currencyOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="button-row">
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Change currency"}
        </button>
      </div>
    </form>
  );
};

export default CurrencyForm;
