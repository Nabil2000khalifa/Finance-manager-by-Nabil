import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader.jsx";
import SectionCard from "../components/SectionCard.jsx";
import RecentTransactions from "../features/dashboard/components/RecentTransactions.jsx";
import SummaryCards from "../features/dashboard/components/SummaryCards.jsx";
import { dashboardService } from "../features/dashboard/dashboard.service.js";
import { useAuth } from "../hooks/useAuth.js";

const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    recentTransactions: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      setIsLoading(true);
      setError("");

      try {
        const data = await dashboardService.getSummary();
        setSummary(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <>
      <PageHeader
        title={`Overview for ${user?.name?.split(" ")[0] || "you"}`}
        description="Track balances, cash flow, and the activity that matters most right now."
      />

      {error ? <div className="message-banner error">{error}</div> : null}

      {isLoading ? (
        <SectionCard title="Loading dashboard" description="Pulling your latest summary data." />
      ) : (
        <>
          <SummaryCards summary={summary} currency={user?.currency} />

          <SectionCard
            title="Recent transactions"
            description="A quick look at the latest activity across your accounts."
          >
            <RecentTransactions transactions={summary.recentTransactions} currency={user?.currency} />
          </SectionCard>
        </>
      )}
    </>
  );
};

export default DashboardPage;
