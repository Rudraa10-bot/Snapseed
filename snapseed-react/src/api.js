const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081";

async function handleResponse(res) {
  if (!res.ok) {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      if (res.status === 400 && typeof data === "object" && !Array.isArray(data)) {
        const error = new Error("Validation failed");
        error.fieldErrors = data;
        throw error;
      }
      throw new Error(data.error || JSON.stringify(data));
    }
    throw new Error(`${res.status} ${res.statusText}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export async function getExpenses() {
  const res = await fetch(`${API_BASE}/expenses`);
  return handleResponse(res);
}

export async function addExpense(expense) {
  const res = await fetch(`${API_BASE}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return handleResponse(res);
}

export async function deleteExpense(id) {
  const res = await fetch(`${API_BASE}/expenses/${id}`, {
    method: "DELETE",
  });
  await handleResponse(res);
}

export async function getBudgets() {
  const res = await fetch(`${API_BASE}/budgets`);
  return handleResponse(res);
}

export async function updateBudget(category, limit) {
  const res = await fetch(`${API_BASE}/budgets/${category}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ limit }),
  });
  return handleResponse(res);
}

export async function getBudgetAlerts() {
  const res = await fetch(`${API_BASE}/budgets/alerts`);
  return handleResponse(res);
}