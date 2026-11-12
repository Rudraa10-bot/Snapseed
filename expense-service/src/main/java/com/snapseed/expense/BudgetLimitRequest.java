package com.snapseed.expense;

/** Incoming JSON for PUT /budgets/{category}. The rules on the limit live in BudgetService. */
public record BudgetLimitRequest(Double limit) {
}
