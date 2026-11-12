package com.snapseed.expense;

/**
 * Result of the budget business rules for one category.
 * status is ON_TRACK, NEARING_LIMIT (80% or more) or OVER_BUDGET (100% or more).
 */
public record BudgetStatus(
        String category,
        double spent,
        double limit,
        long percent,
        String status) {
}
