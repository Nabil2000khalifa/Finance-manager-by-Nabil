import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader.jsx";
import SectionCard from "../components/SectionCard.jsx";
import { accountsService } from "../features/accounts/accounts.service.js";
import TransactionForm from "../features/transactions/components/TransactionForm.jsx";
import TransactionList from "../features/transactions/components/TransactionList.jsx";
import { transactionsService } from "../features/transactions/transactions.service.js";
import { useAuth } from "../hooks/useAuth.js";

const TransactionsPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPageData = async (activeFilters = filters) => {
    setIsLoading(true);
    setError("");

    try {
      const [accountsData, transactionsData] = await Promise.all([
        accountsService.getAccounts(),
        transactionsService.getTransactions(activeFilters),
      ]);

      setAccounts(accountsData);
      setTransactions(transactionsData);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const handleCreateTransaction = async (payload) => {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      await transactionsService.createTransaction(payload);
      setMessage("Transaction added successfully.");
      await loadPageData();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm("Delete this transaction?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await transactionsService.deleteTransaction(transactionId);
      setMessage("Transaction deleted successfully.");
      await loadPageData();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const handleApplyFilters = async (event) => {
    event.preventDefault();
    await loadPageData(filters);
  };

  const handleClearFilters = async () => {
    const clearedFilters = { type: "", startDate: "", endDate: "" };
    setFilters(clearedFilters);
    await loadPageData(clearedFilters);
  };

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Capture income and expenses, then slice the history by date or type."
      />

      {message ? <div className="message-banner success">{message}</div> : null}
      {error ? <div className="message-banner error">{error}</div> : null}

      <div className="grid-two">
        <SectionCard
          title="Add a transaction"
          description="Choose an account and record an income or expense in a few clicks."
        >
          <TransactionForm accounts={accounts} onSubmit={handleCreateTransaction} isSubmitting={isSaving} />
        </SectionCard>

        <SectionCard
          title="Filter history"
          description="Narrow the list to a type or a date range."
        >
          <form onSubmit={handleApplyFilters}>
            <div className="inline-filter">
              <div className="field">
                <label htmlFor="filter-type">Type</label>
                <select
                  id="filter-type"
                  value={filters.type}
                  onChange={(event) => setFilters((current) => ({ ...current, type: event.target.value }))}
                >
                  <option value="">All types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="filter-start-date">Start date</label>
                <input
                  id="filter-start-date"
                  type="date"
                  value={filters.startDate}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, startDate: event.target.value }))
                  }
                />
              </div>

              <div className="field">
                <label htmlFor="filter-end-date">End date</label>
                <input
                  id="filter-end-date"
                  type="date"
                  value={filters.endDate}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, endDate: event.target.value }))
                  }
                />
              </div>

              <div className="button-row">
                <button type="submit" className="primary-button">
                  Apply
                </button>
                <button type="button" className="secondary-button" onClick={handleClearFilters}>
                  Clear
                </button>
              </div>
            </div>
          </form>
        </SectionCard>
      </div>

      <SectionCard
        title="Transaction history"
        description="Review, verify, and clean up the records already saved."
      >
        {isLoading ? (
          <p className="muted-text">Loading transactions...</p>
        ) : (
          <TransactionList
            transactions={transactions}
            currency={user?.currency}
            onDelete={handleDeleteTransaction}
          />
        )}
      </SectionCard>
    </>
  );
};

export default TransactionsPage;
