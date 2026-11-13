package com.snapseed.expense;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class BudgetService {

    private static final Logger logger = LoggerFactory.getLogger(BudgetService.class);

    private static final long WARNING_PERCENT = 80;
    private static final long EXCEEDED_PERCENT = 100;

    private final BudgetRepository budgetRepository;
    private final ExpenseService expenseService;

    public BudgetService(BudgetRepository budgetRepository, ExpenseService expenseService) {
        this.budgetRepository = budgetRepository;
        this.expenseService = expenseService;
    }

    public List<BudgetStatus> getAllStatuses(String username) {
        Map<String, Double> spent = expenseService.totalsByCategory(username);
        return budgetRepository.findAll().stream()
                .map(b -> toStatus(b, spent.getOrDefault(b.getCategory(), 0.0)))
                .toList();
    }

    public BudgetStatus getStatus(String category, String username) {
        Budget budget = budgetRepository.findByCategory(category)
                .orElseThrow(() -> new BudgetNotFoundException(category));
        double spent = expenseService.totalsByCategory(username).getOrDefault(category, 0.0);
        return toStatus(budget, spent);
    }

    // Business rule: a budget limit must be greater than 0, and the category must exist
    public BudgetStatus updateLimit(String category, Double newLimit) {
        if (newLimit == null || newLimit <= 0) {
            throw new IllegalArgumentException("limit must be greater than 0");
        }
        budgetRepository.findByCategory(category)
                .orElseThrow(() -> new BudgetNotFoundException(category));
        budgetRepository.save(new Budget(category, newLimit));
        logger.info("Service: budget limit for {} changed to {}", category, newLimit);
        // Note: Budget limits are shared across all users (global entity),
        // so this change affects all users.
        return getStatus(category, null);
    }

    // Business rule: alerts are the categories at 80% or more, highest percentage first
    public List<BudgetStatus> getAlerts(String username) {
        return getAllStatuses(username).stream()
                .filter(s -> s.percent() >= WARNING_PERCENT)
                .sorted(Comparator.comparingLong(BudgetStatus::percent).reversed())
                .toList();
    }

    // Business rule: 80% or more is NEARING_LIMIT, 100% or more is OVER_BUDGET
    private BudgetStatus toStatus(Budget budget, double spent) {
        long percent = Math.round(spent * 100.0 / budget.getMonthlyLimit());
        String status = percent >= EXCEEDED_PERCENT ? "OVER_BUDGET"
                : percent >= WARNING_PERCENT ? "NEARING_LIMIT"
                : "ON_TRACK";
        return new BudgetStatus(budget.getCategory(), spent, budget.getMonthlyLimit(), percent, status);
    }
}