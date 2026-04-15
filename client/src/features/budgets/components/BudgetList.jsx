import EmptyState from "../../../components/EmptyState.jsx";
import { formatCurrency } from "../../../utils/formatters.js";

const BudgetList = ({ budgets, currency }) => {
  if (!budgets.length) {
    return (
      <EmptyState
        title="No budgets for this month"
        description="Set one up to compare your spending against a monthly target."
      />
    );
  }

  return (
    <div className="stack-list">
      {budgets.map((budget) => {
        const percentage = Math.min(budget.percentageUsed, 100);

        return (
          <div key={budget.id} className="table-row">
            <div>
              <strong>{budget.category}</strong>
              <p className="meta-text">Month: {budget.month}</p>
            </div>

            <div>
              <strong>{formatCurrency(budget.spent, currency)}</strong>
              <p className="meta-text">
                of {formatCurrency(budget.limit, currency)} used
              </p>
            </div>

            <div className="full-width">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${percentage}%` }} />
              </div>
              <p className="meta-text">
                Remaining: {formatCurrency(budget.remaining, currency)} ({budget.percentageUsed}% used)
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BudgetList;
