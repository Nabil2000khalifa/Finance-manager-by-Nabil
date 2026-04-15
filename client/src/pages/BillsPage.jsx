import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader.jsx";
import SectionCard from "../components/SectionCard.jsx";
import { accountsService } from "../features/accounts/accounts.service.js";
import BillForm from "../features/bills/components/BillForm.jsx";
import BillList from "../features/bills/components/BillList.jsx";
import { billsService } from "../features/bills/bills.service.js";
import { useAuth } from "../hooks/useAuth.js";

const BillsPage = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [bills, setBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPageData = async () => {
    setIsLoading(true);
    setError("");

    try {
      const [accountsData, billsData] = await Promise.all([
        accountsService.getAccounts(),
        billsService.getBills(),
      ]);

      setAccounts(accountsData);
      setBills(billsData);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  const handleCreateBill = async (payload) => {
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      await billsService.createBill(payload);
      setMessage("Recurring bill added successfully.");
      await loadPageData();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Bills"
        description="Stay ahead of recurring payments and keep due dates visible."
      />

      {message ? <div className="message-banner success">{message}</div> : null}
      {error ? <div className="message-banner error">{error}</div> : null}

      <div className="grid-two">
        <SectionCard
          title="Add recurring bill"
          description="Capture the amount, due date, frequency, and optional linked account."
        >
          <BillForm accounts={accounts} onSubmit={handleCreateBill} isSubmitting={isSaving} />
        </SectionCard>

        <SectionCard
          title="Upcoming bills"
          description="Bills are sorted by due date so the closest ones stay on top."
        >
          {isLoading ? (
            <p className="muted-text">Loading bills...</p>
          ) : (
            <BillList bills={bills} currency={user?.currency} />
          )}
        </SectionCard>
      </div>
    </>
  );
};

export default BillsPage;
