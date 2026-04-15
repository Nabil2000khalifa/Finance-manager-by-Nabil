import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader.jsx";
import SectionCard from "../components/SectionCard.jsx";
import BudgetForm from "../features/budgets/components/BudgetForm.jsx";
import BudgetList from "../features/budgets/components/BudgetList.jsx";
import { budgetsService } from "../features/budgets/budgets.service.js";
import { useAuth } from "../hooks/useAuth.js";
import { getCurrentMonthValue } from "../utils/constants.js";

const BudgetsPage = () => {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());
  const [budgets, setBudgets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadBudgets = async (month) => {
    setIsLoading(true);
    setError("");

    try {
      const data = await budgetsService.getBudgets(month);
      setBudgets(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets(selectedMonth);
  }, [selectedMonth]);

  const handleSaveBudget = async (payload) => {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      await budgetsService.saveBudget(payload);
      setSelectedMonth(payload.month);
      setMessage("Budget saved successfully.");
      await loadBudgets(payload.month);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Budgets"
        description="Set monthly targets by category and see how current spending stacks up."
      >
        <div className="field">
          <label htmlFor="selected-month">Viewing month</label>
          <input
            id="selected-month"
            type="month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
          />
        </div>
      </PageHeader>

      {message ? <div className="message-banner success">{message}</div> : null}
      {error ? <div className="message-banner error">{error}</div> : null}

      <div className="grid-two">
        <SectionCard
          title="Create or update budget"
          description="Budgets are stored per category and month, so saving again will update the target."
        >
          <BudgetForm onSubmit={handleSaveBudget} isSubmitting={isSaving} defaultMonth={selectedMonth} />
        </SectionCard>

        <SectionCard
          title="Monthly progress"
          description="Each card compares spending with the saved limit for the selected month."
        >
          {isLoading ? (
            <p className="muted-text">Loading budgets...</p>
          ) : (
            <BudgetList budgets={budgets} currency={user?.currency} />
          )}
        </SectionCard>
      </div>
    </>
  );
};

export default BudgetsPage;
