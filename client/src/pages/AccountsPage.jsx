import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader.jsx";
import SectionCard from "../components/SectionCard.jsx";
import AccountForm from "../features/accounts/components/AccountForm.jsx";
import AccountsList from "../features/accounts/components/AccountsList.jsx";
import TransferForm from "../features/accounts/components/TransferForm.jsx";
import { accountsService } from "../features/accounts/accounts.service.js";
import { useAuth } from "../hooks/useAuth.js";

const AccountsPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadAccounts = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await accountsService.getAccounts();
      setAccounts(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreateAccount = async (payload) => {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      await accountsService.createAccount(payload);
      setMessage("Account created successfully.");
      await loadAccounts();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTransfer = async (payload) => {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      await accountsService.transferBetweenAccounts(payload);
      setMessage("Transfer completed successfully.");
      await loadAccounts();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Accounts"
        description="Manage cash and bank accounts, then move money between them when needed."
      />

      {message ? <div className="message-banner success">{message}</div> : null}
      {error ? <div className="message-banner error">{error}</div> : null}

      <div className="grid-two">
        <SectionCard
          title="Create account"
          description="Add another wallet, bank account, or cash pocket to track separately."
        >
          <AccountForm onSubmit={handleCreateAccount} isSubmitting={isSaving} />
        </SectionCard>

        <SectionCard
          title="Transfer funds"
          description="Move money between two of your existing accounts."
        >
          <TransferForm accounts={accounts} onSubmit={handleTransfer} isSubmitting={isSaving} />
        </SectionCard>
      </div>

      <SectionCard
        title="Current balances"
        description="This list updates as transactions and transfers change each account balance."
      >
        {isLoading ? (
          <p className="muted-text">Loading accounts...</p>
        ) : (
          <AccountsList accounts={accounts} currency={user?.currency} />
        )}
      </SectionCard>
    </>
  );
};

export default AccountsPage;
