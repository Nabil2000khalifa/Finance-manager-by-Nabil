import { formatCurrency } from "../../../utils/formatters.js";

const SummaryCards = ({ summary, currency }) => {
  const cards = [
    {
      title: "Total balance",
      description: "Combined balance across all your accounts.",
      value: formatCurrency(summary.totalBalance, currency),
    },
    {
      title: "Total income",
      description: "All income transactions recorded so far.",
      value: formatCurrency(summary.totalIncome, currency),
    },
    {
      title: "Total expense",
      description: "All expense transactions recorded so far.",
      value: formatCurrency(summary.totalExpense, currency),
    },
  ];

  return (
    <div className="grid-three">
      {cards.map((card) => (
        <article key={card.title} className="summary-card">
          <p className="eyebrow">{card.title}</p>
          <h3>{card.description}</h3>
          <strong>{card.value}</strong>
        </article>
      ))}
    </div>
  );
};

export default SummaryCards;
