package com.snapseed.expense;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, String> {

    Optional<Budget> findByCategory(String category);
}