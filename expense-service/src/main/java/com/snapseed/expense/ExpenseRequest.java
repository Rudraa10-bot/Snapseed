package com.snapseed.expense;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

/** Incoming JSON for POST /expenses, validated before it reaches the service. */
public record ExpenseRequest(
        @NotNull(message = "date is required (yyyy-MM-dd)")
        LocalDate date,

        @NotBlank(message = "desc is required")
        String desc,

        @NotNull(message = "category is required")
        @Pattern(regexp = "food|transport|shopping|utilities|other",
                 message = "category must be food, transport, shopping, utilities or other")
        String category,

        @NotNull(message = "amount is required")
        @Positive(message = "amount must be greater than 0")
        Double amount,

        String payment) {
}
