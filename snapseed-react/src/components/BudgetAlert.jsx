import { categoryLabels } from "../data";

function BudgetAlert({ expenses, budgets }) {
  const spentByCategory = (cat) =>
    expenses
      .filter((exp) => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);

  // Find the category closest to or over its limit
  const alerts = Object.keys(budgets)
    .map((cat) => {
      const spent = spentByCategory(cat);
      const limit = budgets[cat];
      const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
      return { cat, spent, limit, percent };
    })
    .filter((a) => a.percent >= 80)
    .sort((a, b) => b.percent - a.percent);

  if (alerts.length === 0) {
    return (
      <section className="section section-grey">
        <div className="container">
          <h2 className="section-title">Budget Reminder</h2>
          <div className="alert-box">
            <h3>All budgets are on track</h3>
            <p>No category has crossed 80% of its monthly limit yet.</p>
          </div>
        </div>
      </section>
    );
  }

  const top = alerts[0];
  const remaining = top.limit - top.spent;
  const label = categoryLabels[top.cat];

  return (
    <section className="section section-grey">
      <div className="container">
        <h2 className="section-title">Budget Reminder</h2>
        <div className="alert-box">
          <h3>
            {top.percent >= 100
              ? `${label} budget has been exceeded`
              : `${label} budget is almost used up`}
          </h3>
          <p>
            Your {label} budget is {top.percent}% used.{" "}
            {remaining >= 0
              ? `Only \u20b9${remaining.toLocaleString("en-IN")} remaining this month.`
              : `You are \u20b9${Math.abs(remaining).toLocaleString("en-IN")} over budget.`}
          </p>
        </div>
      </div>
    </section>
  );
}

export default BudgetAlert;
