import { useState } from "react";
import { paymentLabels } from "../data";

const emptyForm = {
  description: "",
  amount: "",
  category: "",
  date: "",
  payment: "upi",
  notes: ""
};

function AddExpenseForm({ onAddExpense }) {
  const [form, setForm] = useState(emptyForm);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // stops page reload — the issue seen in the HTML-only version

    if (!form.description || !form.amount || !form.category || !form.date) {
      alert("Please fill in all required fields.");
      return;
    }

    onAddExpense({
      id: Date.now(),
      date: form.date, // stored as ISO (yyyy-mm-dd) — formatted for display in ExpenseTable
      desc: form.description,
      category: form.category,
      amount: parseFloat(form.amount),
      payment: paymentLabels[form.payment] || form.payment
    });

    setForm(emptyForm);
  };

  return (
    <section className="section" id="add-expense">
      <div className="container">
        <h2 className="section-title">Add New Expense</h2>
        <p className="section-desc">Fill in the details below to add an expense.</p>

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

            <div className="form-group full-width">
              <label htmlFor="notes">Notes (Optional)</label>
              <textarea
                id="notes"
                placeholder="Any extra details..."
                rows="3"
                value={form.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Save Expense</button>
              <button type="button" className="btn btn-outline" onClick={() => setForm(emptyForm)}>Clear</button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AddExpenseForm;
