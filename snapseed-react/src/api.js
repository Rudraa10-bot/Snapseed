const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8081";

let credentials = null;
let unauthenticatedHandler = null;

function loadStoredCredentials() {
  const stored = localStorage.getItem("snapseed_auth");
  if (stored) {
    try {
      const { username, password } = JSON.parse(stored);
      credentials = { username, password };
    } catch {
      localStorage.removeItem("snapseed_auth");
    }
  }
}

loadStoredCredentials();

function getAuthHeader() {
  if (!credentials) return null;
  const token = btoa(`${credentials.username}:${credentials.password}`);
  return `Basic ${token}`;
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  const authHeader = getAuthHeader();
  if (authHeader) headers.Authorization = authHeader;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearCredentials();
    if (unauthenticatedHandler) unauthenticatedHandler();
    throw new Error("Unauthenticated");
  }

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

export function setCredentials(username, password, remember) {
  credentials = { username, password };
  if (remember) {
    localStorage.setItem("snapseed_auth", JSON.stringify({ username, password }));
  } else {
    localStorage.removeItem("snapseed_auth");
  }
}

export function clearCredentials() {
  credentials = null;
  localStorage.removeItem("snapseed_auth");
}

export function getCredentials() {
  return credentials;
}

export function isAuthenticated() {
  return !!credentials;
}

export function onUnauthenticated(handler) {
  unauthenticatedHandler = handler;
}

export async function login(username, password) {
  const token = btoa(`${username}:${password}`);
  try {
    const res = await fetch(`${API_BASE}/budgets`, {
      headers: { Authorization: `Basic ${token}` },
    });
    if (res.status === 200) {
      setCredentials(username, password, false);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function register(username, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.status === 201) {
      // Immediately sign in with the new credentials
      await login(username, password);
      return true;
    }

    if (res.status === 400 || res.status === 409) {
      const data = await res.json();
      const field = Object.keys(data)[0];
      throw new Error(data[field] || `Registration failed: ${res.status}`);
    }

    throw new Error(`Registration failed: ${res.status}`);
  } catch (err) {
    if (err.message.startsWith("Registration failed")) throw err;
    throw new Error("Network error. Please try again.");
  }
}

export async function getExpenses() {
  return request("/expenses");
}

export async function addExpense(expense) {
  return request("/expenses", {
    method: "POST",
    body: JSON.stringify(expense),
  });
}

export async function deleteExpense(id) {
  return request(`/expenses/${id}`, { method: "DELETE" });
}

export async function getBudgets() {
  return request("/budgets");
}

export async function updateBudget(category, limit) {
  return request(`/budgets/${category}`, {
    method: "PUT",
    body: JSON.stringify({ limit }),
  });
}

export async function getBudgetAlerts() {
  return request("/budgets/alerts");
}