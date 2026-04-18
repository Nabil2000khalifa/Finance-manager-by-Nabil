import { memo, useState, useCallback, useMemo } from "react";
import PageHeader from "../components/PageHeader.jsx";
import SectionCard from "../components/SectionCard.jsx";
import TransactionForm from "../features/transactions/components/TransactionForm.jsx";
import TransactionList from "../features/transactions/components/TransactionList.jsx";
import { useTransactions, useCreateTransaction, useDeleteTransaction } from "../hooks/useTransactions.js";
import { useAccounts } from "../hooks/useAccounts.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useAuth } from "../hooks/useAuth.js";

const MemoizedTransactionForm = memo(TransactionForm);
const MemoizedTransactionList = memo(TransactionList);

const TransactionsPage = () => {
  const { user } = useAuth();

  // Local filters state
  const [localFilters, setLocalFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });

  // Debounce filters to avoid excessive API calls
  const debouncedFilters = useDebounce(localFilters, 500);

  // React Query hooks
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: transactions = [], isLoading: transactionsLoading, error: transactionsError } = useTransactions(debouncedFilters);
  const createMutation = useCreateTransaction();
  const deleteMutation = useDeleteTransaction();

  // Message states
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Clear messages after 3 seconds
  const clearMessages = useCallback(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Memoized handlers with useCallback
  const handleCreateTransaction = useCallback(
    async (payload) => {
      try {
        await createMutation.mutateAsync(payload);
        setSuccessMessage("Transaction added successfully.");
        clearMessages();
      } catch (error) {
        setErrorMessage(error.message || "Failed to create transaction");
        clearMessages();
      }
    },
    [createMutation, clearMessages]
  );

  const handleDeleteTransaction = useCallback(
    async (transactionId) => {
      if (!window.confirm("Delete this transaction?")) {
        return;
      }

      try {
        await deleteMutation.mutateAsync(transactionId);
        setSuccessMessage("Transaction deleted successfully.");
        clearMessages();
      } catch (error) {
        setErrorMessage(error.message || "Failed to delete transaction");
        clearMessages();
      }
    },
    [deleteMutation, clearMessages]
  );

  const handleApplyFilters = useCallback((event) => {
    event.preventDefault();
    // Filters are already being applied via debounce
  }, []);

  const handleClearFilters = useCallback(() => {
    setLocalFilters({ type: "", startDate: "", endDate: "" });
  }, []);

  // Memoize filter change handler
  const handleFilterChange = useCallback((filterKey, value) => {
    setLocalFilters((current) => ({ ...current, [filterKey]: value }));
  }, []);

  const isLoading = accountsLoading || transactionsLoading;
  const displayError = transactionsError || errorMessage;

  return (
    <>
      <PageHeader
        title="Transactions"
        description="Capture income and expenses, then slice the history by date or type."
      />

      {successMessage && <div className="message-banner success">{successMessage}</div>}
      {displayError && <div className="message-banner error">{displayError.message || displayError}</div>}

      <div className="grid-two">
        <SectionCard
          title="Add a transaction"
          description="Choose an account and record an income or expense in a few clicks."
        >
          <MemoizedTransactionForm
            accounts={accounts}
            onSubmit={handleCreateTransaction}
            isSubmitting={createMutation.isPending}
          />
        </SectionCard>

        <SectionCard title="Filter history" description="Narrow the list to a type or a date range.">
          <form onSubmit={handleApplyFilters}>
            <div className="inline-filter">
              <div className="field">
                <label htmlFor="filter-type">Type</label>
                <select
                  id="filter-type"
                  value={localFilters.type}
                  onChange={(event) => handleFilterChange("type", event.target.value)}
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
                  value={localFilters.startDate}
                  onChange={(event) => handleFilterChange("startDate", event.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="filter-end-date">End date</label>
                <input
                  id="filter-end-date"
                  type="date"
                  value={localFilters.endDate}
                  onChange={(event) => handleFilterChange("endDate", event.target.value)}
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
          <MemoizedTransactionList
            transactions={transactions}
            currency={user?.currency}
            onDelete={handleDeleteTransaction}
            isDeleting={deleteMutation.isPending}
          />
        )}
      </SectionCard>
    </>
  );
};

export default memo(TransactionsPage);
