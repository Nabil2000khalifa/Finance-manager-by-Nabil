import EmptyState from "../../../components/EmptyState.jsx";
import { formatCurrency, formatDate } from "../../../utils/formatters.js";

const BillList = ({ bills, currency }) => {
  if (!bills.length) {
    return (
      <EmptyState
        title="No recurring bills yet"
        description="Add bills here so due dates and reminders stay in one place."
      />
    );
  }

  return (
    <div className="stack-list">
      {bills.map((bill) => {
        const statusClass =
          bill.status === "overdue"
            ? "status-danger"
            : bill.status === "due soon" || bill.status === "due today"
              ? "status-warning"
              : "status-success";

        return (
          <div key={bill.id} className="bill-row">
            <div>
              <strong>{bill.name}</strong>
              <p className="meta-text">
                Due {formatDate(bill.dueDate)} • {bill.frequency}
              </p>
              <p className="meta-text">
                {bill.account?.name ? `Linked account: ${bill.account.name}` : "No linked account"}
              </p>
            </div>

            <div>
              <strong>{formatCurrency(bill.amount, currency)}</strong>
              <p className={`meta-text ${statusClass}`}>
                {bill.status} ({bill.daysUntilDue} day{Math.abs(bill.daysUntilDue) === 1 ? "" : "s"})
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BillList;
