import EmptyState from "../../../components/EmptyState.jsx";
import { formatCurrency, formatDate, formatSignedAmount } from "../../../utils/formatters.js";

const RecentTransactions = ({ transactions, currency }) => {
  if (!transactions.length) {
    return (
      <EmptyState
        title="No recent transactions"
        description="Once you add income, expenses, or transfers, they will appear here."
      />
    );
  }

  return (
    <div className="table-list">
      {transactions.map((transaction) => {
        const isExpense = transaction.type === "expense";
        const isTransfer = transaction.type === "transfer";

        return (
          <div key={transaction._id} className="table-row">
            <div>
              <strong>{transaction.category}</strong>
              <p className="meta-text">
                {isTransfer
                  ? `${transaction.account?.name || "From"} -> ${transaction.transferAccount?.name || "To"}`
                  : transaction.account?.name || "Account"}
              </p>
              <p className="meta-text">{formatDate(transaction.date)}</p>
            </div>

            <div>
              <strong className={isExpense ? "amount-negative" : "amount-positive"}>
                {isTransfer
                  ? formatCurrency(transaction.amount, currency)
                  : formatSignedAmount(transaction.amount, transaction.type, currency)}
              </strong>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentTransactions;
