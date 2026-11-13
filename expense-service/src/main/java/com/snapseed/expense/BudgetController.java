package com.snapseed.expense;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
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

    private String currentUsername(Authentication authentication) {
        return authentication.getName();
    }

    @GetMapping
    public List<BudgetStatus> list(Authentication authentication) {
        logger.info("Controller: GET /budgets");
        return budgetService.getAllStatuses(currentUsername(authentication));
    }

    @GetMapping("/alerts")
    public List<BudgetStatus> alerts(Authentication authentication) {
        logger.info("Controller: GET /budgets/alerts");
        return budgetService.getAlerts(currentUsername(authentication));
    }

    @GetMapping("/{category}")
    public BudgetStatus get(@PathVariable String category, Authentication authentication) {
        return budgetService.getStatus(category, currentUsername(authentication));
    }

    @PutMapping("/{category}")
    public BudgetStatus update(@PathVariable String category,
                               @RequestBody BudgetLimitRequest request,
                               Authentication authentication) {
        logger.info("Controller: PUT /budgets/{}", category);
        return budgetService.updateLimit(category, request.limit());
    }
}