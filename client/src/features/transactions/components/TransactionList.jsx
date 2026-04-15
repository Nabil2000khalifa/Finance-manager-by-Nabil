import EmptyState from "../../../components/EmptyState.jsx";
import { formatCurrency, formatDate, formatSignedAmount } from "../../../utils/formatters.js";

const TransactionList = ({ transactions, currency, onDelete }) => {
  if (!transactions.length) {
    return (
      <EmptyState
        title="No transactions found"
        description="Try adding a transaction or adjusting the filters above."
      />
    );
  }

  return (
    <div className="stack-list">
      {transactions.map((transaction) => {
        const isExpense = transaction.type === "expense";
        const isTransfer = transaction.type === "transfer";

        return (
          <div key={transaction._id} className="list-row">
            <div>
              <strong>{transaction.category}</strong>
              <p className="meta-text">
                {isTransfer
                  ? `${transaction.account?.name || "From"} -> ${transaction.transferAccount?.name || "To"}`
                  : transaction.account?.name || "Account"}
              </p>
              {transaction.description ? <p className="meta-text">{transaction.description}</p> : null}
              <p className="meta-text">{formatDate(transaction.date)}</p>
            </div>

            <div className="button-row">
              <strong className={isExpense ? "amount-negative" : "amount-positive"}>
                {isTransfer
                  ? formatCurrency(transaction.amount, currency)
                  : formatSignedAmount(transaction.amount, transaction.type, currency)}
              </strong>
              <button type="button" className="danger-button" onClick={() => onDelete(transaction._id)}>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TransactionList;
