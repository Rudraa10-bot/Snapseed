package com.snapseed.expense;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/** API layer: maps HTTP requests to service calls. */
@RestController
@RequestMapping("/expenses")
@CrossOrigin // lets the React frontend (another port) call this service
public class ExpenseController {

    private static final Logger logger = LoggerFactory.getLogger(ExpenseController.class);

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<Expense> list() {
        logger.info("GET /expenses");
        return expenseService.getAll();
    }

    @GetMapping("/{id}")
    public Expense get(@PathVariable long id) {
        return expenseService.getById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Expense create(@Valid @RequestBody ExpenseRequest request) {
        return expenseService.add(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        expenseService.delete(id);
    }

    @GetMapping("/summary")
    public Map<String, Double> summary() {
        return expenseService.totalsByCategory();
    }
}
