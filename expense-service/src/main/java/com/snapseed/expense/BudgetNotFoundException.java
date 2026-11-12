package com.snapseed.expense;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class BudgetNotFoundException extends RuntimeException {

    public BudgetNotFoundException(String category) {
        super("Budget for category '" + category + "' not found");
    }
}
