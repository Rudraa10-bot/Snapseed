import { categoryLabels } from "../data";

function BudgetCard({ category, spent, limit }) {
  const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;

  let barClass = "";
  let statusText = `${percent}% used`;

  if (percent >= 100) {
    barClass = "danger";
    statusText = `${percent}% used — over budget`;
  } else if (percent >= 80) {
    barClass = "warning";
    statusText = `${percent}% used — nearing limit`;
  }

  return (
    <div className="budget-card">
      <div className="budget-card-header">
        <h3>{categoryLabels[category]}</h3>
        <span>&#8377;{spent.toLocaleString("en-IN")} / &#8377;{limit.toLocaleString("en-IN")}</span>
      </div>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${barClass}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        ></div>
      </div>
      <p className="percent">{statusText}</p>
    </div>
  );
}

export default BudgetCard;
