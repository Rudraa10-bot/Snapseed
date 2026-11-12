import { useState } from "react";
import { paymentLabels } from "../data";

const emptyForm = {
  description: "",
  amount: "",
  category: "",
  date: "",
  payment: "upi"
};

function AddExpenseForm({ onAddExpense }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.description || !form.amount || !form.category || !form.date) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const expenseData = {
      date: form.date,
      desc: form.description,
      category: form.category,
      amount: parseFloat(form.amount),
      payment: paymentLabels[form.payment] || form.payment
    };

    const success = await onAddExpense(expenseData);
    setSubmitting(false);

    if (success) {
      setForm(emptyForm);
    }
  };

  return (
    <section className="section" id="add-expense">
      <div className="container">
        <h2 className="section-title">Add New Expense</h2>
        <p className="section-desc">Fill in the details below to add an expense.</p>

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
          </div>
        )}

        <form className="expense-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="description">Expense Description</label>
              <input
                type="text"
                id="description"
                placeholder="e.g. Domino's Pizza"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="amount">Amount (&#8377;)</label>
              <input
                type="number"
                id="amount"
                placeholder="e.g. 450"
                min="1"
                value={form.amount}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" value={form.category} onChange={handleChange}>
                <option value="" disabled>Select category</option>
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="shopping">Shopping</option>
                <option value="utilities">Utilities</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input type="date" id="date" value={form.date} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label htmlFor="payment">Payment Method</label>
              <select id="payment" value={form.payment} onChange={handleChange}>
                <option value="upi">UPI</option>
                <option value="card">Card</option>
                <option value="cash">Cash</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Saving..." : "Save Expense"}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setForm(emptyForm)} disabled={submitting}>Clear</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AddExpenseForm;