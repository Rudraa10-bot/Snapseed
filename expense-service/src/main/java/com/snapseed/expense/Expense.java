package com.snapseed.expense;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "expense_date")
    private LocalDate date;

    @Column(name = "description")
    private String desc;

    private String category;
    private double amount;
    private String payment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    @JsonIgnore
    private User owner;

    protected Expense() {
    }

    public Expense(LocalDate date, String desc, String category,
                   double amount, String payment) {
        this.date = date;
        this.desc = desc;
        this.category = category;
        this.amount = amount;
        this.payment = payment;
    }

    public Expense(LocalDate date, String desc, String category,
                   double amount, String payment, User owner) {
        this(date, desc, category, amount, payment);
        this.owner = owner;
    }

    public Long getId() { return id; }
    public LocalDate getDate() { return date; }
    public String getDesc() { return desc; }
    public String getCategory() { return category; }
    public double getAmount() { return amount; }
    public String getPayment() { return payment; }
    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
}