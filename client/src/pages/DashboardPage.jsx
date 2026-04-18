import { memo } from "react";
import PageHeader from "../components/PageHeader.jsx";
import SectionCard from "../components/SectionCard.jsx";
import RecentTransactions from "../features/dashboard/components/RecentTransactions.jsx";
import SummaryCards from "../features/dashboard/components/SummaryCards.jsx";
import { useDashboardSummary } from "../hooks/useDashboard.js";
import { useAuth } from "../hooks/useAuth.js";

// Memoized components to prevent unnecessary re-renders
const MemoizedSummaryCards = memo(SummaryCards);
const MemoizedRecentTransactions = memo(RecentTransactions);

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: summary, isLoading, error, isFetching } = useDashboardSummary();

  const defaultSummary = {
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    recentTransactions: [],
  };

  const displaySummary = summary || defaultSummary;

  return (
    <>
      <PageHeader
        title={`Overview for ${user?.name?.split(" ")[0] || "you"}`}
        description="Track balances, cash flow, and the activity that matters most right now."
      />

      {error && <div className="message-banner error">{error.message || "Failed to load dashboard"}</div>}

      {isLoading ? (
        <SectionCard title="Loading dashboard" description="Pulling your latest summary data." />
      ) : (
        <>
          <MemoizedSummaryCards summary={displaySummary} currency={user?.currency} />

          <SectionCard
            title="Recent transactions"
            description="A quick look at the latest activity across your accounts."
          >
            {isFetching && <div style={{ fontSize: "0.85rem", color: "var(--text-soft)" }}>Updating...</div>}
            <MemoizedRecentTransactions transactions={displaySummary.recentTransactions} currency={user?.currency} />
          </SectionCard>
        </>
      )}
    </>
  );
};

export default memo(DashboardPage);
