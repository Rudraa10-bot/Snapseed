import { categoryLabels, formatDate } from "../data";

function ExpenseTable({ expenses }) {
  // Sort chronologically by actual date (oldest to newest)
  const sorted = [...expenses].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <section className="section section-grey" id="expenses">
      <div className="container">
        <h2 className="section-title">Recent Expenses</h2>
        <p className="section-desc">Your latest transactions at a glance.</p>

        <div className="table-wrapper">
          <table className="expense-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Payment Method</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((exp) => (
                <tr key={exp.id}>
                  <td>{formatDate(exp.date)}</td>
                  <td>{exp.desc}</td>
                  <td>
                    <span className={`category-tag tag-${exp.category}`}>
                      {categoryLabels[exp.category] || exp.category}
                    </span>
                  </td>
                  <td>&#8377;{exp.amount.toLocaleString("en-IN")}</td>
                  <td>{exp.payment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ExpenseTable;
