import { useState } from "react";
import BudgetCard from "./BudgetCard";
import { categoryLabels } from "../data";

function BudgetOverview({ expenses, budgets, onUpdateBudget }) {
  const [category, setCategory] = useState("food");
  const [limitInput, setLimitInput] = useState("");

  const spentByCategory = (cat) =>
    expenses
      .filter((exp) => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);

  const handleSetBudget = (e) => {
    e.preventDefault();
    const newLimit = parseFloat(limitInput);
    if (!newLimit || newLimit <= 0) {
      alert("Please enter a valid budget amount.");
      return;
    }
    onUpdateBudget(category, newLimit);
    setLimitInput("");
  };

  return (
    <section className="section" id="budget">
      <div className="container">
        <h2 className="section-title">Monthly Budget</h2>
        <p className="section-desc">See how much you have spent in each category.</p>

        <div className="budget-grid">
          {Object.keys(budgets).map((cat) => (
            <BudgetCard
              key={cat}
              category={cat}
              spent={spentByCategory(cat)}
              limit={budgets[cat]}
            />
          ))}
        </div>

        <form className="expense-form" style={{ marginTop: "28px" }} onSubmit={handleSetBudget}>
          <h3 style={{ marginBottom: "14px", fontSize: "16px" }}>Set Budget Limit</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="budget-category">Category</label>
              <select
                id="budget-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {Object.keys(budgets).map((cat) => (
                  <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="budget-limit">Monthly Limit (&#8377;)</label>
              <input
                type="number"
                id="budget-limit"
                placeholder="e.g. 5000"
                min="1"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Update Budget</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default BudgetOverview;
