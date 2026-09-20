function SummaryCards({ expenses, budgets }) {
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyBudgetTotal = Object.values(budgets).reduce((sum, val) => sum + val, 0);
  const remaining = monthlyBudgetTotal - totalSpending;

  return (
    <section className="section" id="summary">
      <div className="container">
        <h2 className="section-title">Expense Summary</h2>
        <p className="section-desc">A quick look at your spending this month.</p>

        <div className="summary-grid">
          <div className="summary-card">
            <h3>Total Spending</h3>
            <p className="amount">&#8377;{totalSpending.toLocaleString("en-IN")}</p>
          </div>
          <div className="summary-card">
            <h3>Monthly Budget</h3>
            <p className="amount">&#8377;{monthlyBudgetTotal.toLocaleString("en-IN")}</p>
          </div>
          <div className="summary-card">
            <h3>Remaining</h3>
            <p className="amount">&#8377;{remaining.toLocaleString("en-IN")}</p>
          </div>
          <div className="summary-card">
            <h3>Total Expenses</h3>
            <p className="amount">{expenses.length}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SummaryCards;
