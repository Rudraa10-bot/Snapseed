package com.snapseed.expense;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findAllByOrderByDateDesc();

    List<Expense> findByCategory(String category);

    List<Expense> findByOwnerUsernameOrderByDateDesc(String username);

    Optional<Expense> findByIdAndOwnerUsername(Long id, String username);
}