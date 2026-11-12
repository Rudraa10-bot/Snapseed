package com.snapseed.expense;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    private String category;

    private double monthlyLimit;

    protected Budget() {
    }

    public Budget(String category, double monthlyLimit) {
        this.category = category;
        this.monthlyLimit = monthlyLimit;
    }

    public String getCategory() { return category; }
    public double getMonthlyLimit() { return monthlyLimit; }
}