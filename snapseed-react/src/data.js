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

// Formats an ISO date string ("2026-08-18") into display form ("18 Aug")
export function formatDate(isoDate) {
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}