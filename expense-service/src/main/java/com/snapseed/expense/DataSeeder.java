package com.snapseed.expense;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;

    public DataSeeder(ExpenseRepository expenseRepository, BudgetRepository budgetRepository) {
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
    }

    @Override
    public void run(String... args) {
        if (expenseRepository.count() == 0) {
            expenseRepository.save(new Expense(LocalDate.parse("2026-08-18"), "Domino's Pizza", "food", 450, "UPI"));
            expenseRepository.save(new Expense(LocalDate.parse("2026-08-17"), "Uber Ride", "transport", 180, "UPI"));
            expenseRepository.save(new Expense(LocalDate.parse("2026-08-16"), "Amazon Purchase", "shopping", 399, "Card"));
            expenseRepository.save(new Expense(LocalDate.parse("2026-08-15"), "Electricity Bill", "utilities", 1200, "Net Banking"));
        }
        if (budgetRepository.count() == 0) {
            budgetRepository.save(new Budget("food", 5000));
            budgetRepository.save(new Budget("transport", 3000));
            budgetRepository.save(new Budget("shopping", 4000));
            budgetRepository.save(new Budget("utilities", 3000));
            budgetRepository.save(new Budget("other", 1000));
        }
    }
}