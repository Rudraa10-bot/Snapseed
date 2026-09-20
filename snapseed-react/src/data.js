// Shared constants and seed data for SnapSeed

export const categoryLabels = {
  food: "Food",
  transport: "Transport",
  shopping: "Shopping",
  utilities: "Utilities",
  other: "Other"
};

export const paymentLabels = {
  upi: "UPI",
  card: "Card",
  cash: "Cash",
  netbanking: "Net Banking"
};

export const initialExpenses = [
  { id: 1, date: "18 Aug", desc: "Domino's Pizza", category: "food", amount: 450, payment: "UPI" },
  { id: 2, date: "17 Aug", desc: "Uber Ride", category: "transport", amount: 180, payment: "UPI" },
  { id: 3, date: "16 Aug", desc: "Amazon Purchase", category: "shopping", amount: 399, payment: "Card" },
  { id: 4, date: "15 Aug", desc: "Electricity Bill", category: "utilities", amount: 1200, payment: "Net Banking" }
];

export const initialBudgets = {
  food: 5000,
  transport: 3000,
  shopping: 4000,
  utilities: 3000,
  other: 1000
};
