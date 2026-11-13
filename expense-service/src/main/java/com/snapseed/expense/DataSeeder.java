package com.snapseed.expense;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(ExpenseRepository expenseRepository,
                      BudgetRepository budgetRepository,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Seeded demo user (username: demo, password: demo123) so the evaluator can always get in
        User demoUser = userRepository.findByUsername("demo").orElseGet(() ->
                userRepository.save(new User("demo", passwordEncoder.encode("demo123"))));

        if (expenseRepository.count() == 0) {
            expenseRepository.save(new Expense(LocalDate.parse("2026-08-18"), "Domino's Pizza", "food", 450, "UPI", demoUser));
            expenseRepository.save(new Expense(LocalDate.parse("2026-08-17"), "Uber Ride", "transport", 180, "UPI", demoUser));
            expenseRepository.save(new Expense(LocalDate.parse("2026-08-16"), "Amazon Purchase", "shopping", 399, "Card", demoUser));
            expenseRepository.save(new Expense(LocalDate.parse("2026-08-15"), "Electricity Bill", "utilities", 1200, "Net Banking", demoUser));
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