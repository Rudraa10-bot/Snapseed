package com.snapseed.expense;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** API layer for budgets: maps HTTP requests to BudgetService calls. */
@RestController
@RequestMapping("/budgets")
@CrossOrigin
public class BudgetController {

    private static final Logger logger = LoggerFactory.getLogger(BudgetController.class);

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public List<BudgetStatus> list() {
        logger.info("Controller: GET /budgets");
        return budgetService.getAllStatuses();
    }

    @GetMapping("/alerts")
    public List<BudgetStatus> alerts() {
        logger.info("Controller: GET /budgets/alerts");
        return budgetService.getAlerts();
    }

    @GetMapping("/{category}")
    public BudgetStatus get(@PathVariable String category) {
        return budgetService.getStatus(category);
    }

    @PutMapping("/{category}")
    public BudgetStatus update(@PathVariable String category,
                               @RequestBody BudgetLimitRequest request) {
        logger.info("Controller: PUT /budgets/{}", category);
        return budgetService.updateLimit(category, request.limit());
    }
}
