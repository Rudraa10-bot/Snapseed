
let expenses = [
  { date: "18 Aug", desc: "Domino's Pizza", category: "food", amount: 450, payment: "UPI" },
  { date: "17 Aug", desc: "Uber Ride", category: "transport", amount: 180, payment: "UPI" },
  { date: "16 Aug", desc: "Amazon Purchase", category: "shopping", amount: 399, payment: "Card" },
  { date: "15 Aug", desc: "Electricity Bill", category: "utilities", amount: 1200, payment: "Net Banking" }
];

// ---------- Budget Limits per Category ----------
const budgets = {
  food: 5000,
  transport: 3000,
  shopping: 4000,
  utilities: 3000,
  other: 1000
};

// Display-friendly labels
const categoryLabels = {
  food: "Food",
  transport: "Transport",
  shopping: "Shopping",
  utilities: "Utilities",
  other: "Other"
};

const monthlyBudgetTotal = Object.values(budgets).reduce((sum, val) => sum + val, 0);

// ---------- DOM References ----------
const expenseTableBody = document.querySelector(".expense-table tbody");
const budgetGrid = document.querySelector(".budget-grid");
const summaryGrid = document.querySelector(".summary-grid");
const expenseForm = document.querySelector(".expense-form");


// RENDER: Recent Expenses Table

function renderExpenseTable() {
  expenseTableBody.innerHTML = "";

  // Show most recent first
  const sorted = [...expenses].reverse();

  sorted.forEach((exp) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.date}</td>
      <td>${exp.desc}</td>
      <td><span class="category-tag tag-${exp.category}">${categoryLabels[exp.category] || exp.category}</span></td>
      <td>&#8377;${exp.amount.toLocaleString("en-IN")}</td>
      <td>${exp.payment}</td>
    `;
    expenseTableBody.appendChild(row);
  });
}


// RENDER: Expense Summary Cards

function renderSummary() {
  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = monthlyBudgetTotal - totalSpending;

  summaryGrid.innerHTML = `
    <div class="summary-card">
      <h3>Total Spending</h3>
      <p class="amount">&#8377;${totalSpending.toLocaleString("en-IN")}</p>
    </div>
    <div class="summary-card">
      <h3>Monthly Budget</h3>
      <p class="amount">&#8377;${monthlyBudgetTotal.toLocaleString("en-IN")}</p>
    </div>
    <div class="summary-card">
      <h3>Remaining</h3>
      <p class="amount">&#8377;${remaining.toLocaleString("en-IN")}</p>
    </div>
    <div class="summary-card">
      <h3>Total Expenses</h3>
      <p class="amount">${expenses.length}</p>
    </div>
  `;
}


// RENDER: Budget Progress Bars

function renderBudgetGrid() {
  budgetGrid.innerHTML = "";

  Object.keys(budgets).forEach((cat) => {
    const spent = expenses
      .filter((exp) => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);

    const limit = budgets[cat];
    const percent = Math.round((spent / limit) * 100);

    // Determine bar state
    let barClass = "";
    let statusText = `${percent}% used`;

    if (percent >= 100) {
      barClass = "danger";
      statusText = `${percent}% used — over budget`;
    } else if (percent >= 80) {
      barClass = "warning";
      statusText = `${percent}% used — nearing limit`;
    }

    const card = document.createElement("div");
    card.className = "budget-card";
    card.innerHTML = `
      <div class="budget-card-header">
        <h3>${categoryLabels[cat]}</h3>
        <span>&#8377;${spent.toLocaleString("en-IN")} / &#8377;${limit.toLocaleString("en-IN")}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-bar-fill ${barClass}" style="width: ${Math.min(percent, 100)}%;"></div>
      </div>
      <p class="percent">${statusText}</p>
    `;
    budgetGrid.appendChild(card);
  });
}


// RENDER: All (call after any data change)

function renderAll() {
  renderExpenseTable();
  renderSummary();
  renderBudgetGrid();
}


// FORM HANDLING: Add Expense

expenseForm.addEventListener("submit", function (e) {
  e.preventDefault(); // stop page reload — this was the "crash" bug

  const description = document.getElementById("description").value.trim();
  const amount = parseFloat(document.getElementById("amount").value);
  const category = document.getElementById("category").value;
  const dateInput = document.getElementById("date").value;
  const payment = document.getElementById("payment").value;

  if (!description || !amount || !category || !dateInput) {
    alert("Please fill in all required fields.");
    return;
  }

  // Format date (yyyy-mm-dd -> "DD Mon")
  const dateObj = new Date(dateInput);
  const formattedDate = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short"
  });

  // Map payment select values to display labels
  const paymentLabels = {
    upi: "UPI",
    card: "Card",
    cash: "Cash",
    netbanking: "Net Banking"
  };

  expenses.push({
    date: formattedDate,
    desc: description,
    category: category,
    amount: amount,
    payment: paymentLabels[payment] || payment
  });

  renderAll();
  expenseForm.reset();

  // Scroll user to the expenses table so they see the update
  document.getElementById("expenses").scrollIntoView({ behavior: "smooth" });
});


// INIT

renderAll();