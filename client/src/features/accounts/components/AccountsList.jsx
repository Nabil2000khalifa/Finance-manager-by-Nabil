import EmptyState from "../../../components/EmptyState.jsx";
import { formatCurrency } from "../../../utils/formatters.js";

const AccountsList = ({ accounts, currency }) => {
  if (!accounts.length) {
    return (
      <EmptyState
        title="No accounts found"
        description="Create a cash or bank account to start tracking balances."
      />
    );
  }

  return (
    <div className="stack-list">
      {accounts.map((account) => (
        <div key={account._id} className="account-row">
          <div>
            <strong>{account.name}</strong>
            <p className="meta-text">Type: {account.type}</p>
          </div>

          <div>
            <strong>{formatCurrency(account.balance, currency)}</strong>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountsList;
