package com.snapseed.expense;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class ExpenseService {

    private static final Logger logger = LoggerFactory.getLogger(ExpenseService.class);

    private final ExpenseRepository repository;

    public ExpenseService(ExpenseRepository repository) {
        this.repository = repository;
    }

    public List<Expense> getAll() {
        logger.info("Service: fetching all expenses, newest first");
        return repository.findAllByOrderByDateDesc();
    }

    public Expense getById(long id) {
        return repository.findById(id).orElseThrow(() -> new ExpenseNotFoundException(id));
    }

    public Expense add(ExpenseRequest request) {
        String payment = (request.payment() == null || request.payment().isBlank())
                ? "UPI" : request.payment();
        Expense saved = repository.save(new Expense(
                request.date(), request.desc().trim(),
                request.category(), request.amount(), payment));
        logger.info("Expense added: id={}, {} ({})", saved.getId(), saved.getDesc(), saved.getAmount());
        return saved;
    }

    public void delete(long id) {
        if (!repository.existsById(id)) {
            throw new ExpenseNotFoundException(id);
        }
        repository.deleteById(id);
        logger.info("Expense deleted: id={}", id);
    }

    public Map<String, Double> totalsByCategory() {
        Map<String, Double> totals = new TreeMap<>();
        for (Expense e : repository.findAll()) {
            totals.merge(e.getCategory(), e.getAmount(), Double::sum);
        }
        return totals;
    }
}