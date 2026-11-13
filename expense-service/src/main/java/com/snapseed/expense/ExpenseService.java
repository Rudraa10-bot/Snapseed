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
    private final UserRepository userRepository;

    public ExpenseService(ExpenseRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public List<Expense> getAll(String username) {
        logger.info("Service: fetching all expenses for user '{}', newest first", username);
        return repository.findByOwnerUsernameOrderByDateDesc(username);
    }

    public Expense getById(long id, String username) {
        return repository.findByIdAndOwnerUsername(id, username)
                .orElseThrow(() -> new ExpenseNotFoundException(id));
    }

    public Expense add(ExpenseRequest request, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        String payment = (request.payment() == null || request.payment().isBlank())
                ? "UPI" : request.payment();
        Expense expense = new Expense(
                request.date(), request.desc().trim(),
                request.category(), request.amount(), payment);
        expense.setOwner(owner);

        Expense saved = repository.save(expense);
        logger.info("Expense added: id={}, {} ({}) for user '{}'", saved.getId(), saved.getDesc(), saved.getAmount(), username);
        return saved;
    }

    public void delete(long id, String username) {
        Expense expense = repository.findByIdAndOwnerUsername(id, username)
                .orElseThrow(() -> new ExpenseNotFoundException(id));
        repository.delete(expense);
        logger.info("Expense deleted: id={} for user '{}'", id, username);
    }

    public Map<String, Double> totalsByCategory(String username) {
        Map<String, Double> totals = new TreeMap<>();
        for (Expense e : repository.findByOwnerUsernameOrderByDateDesc(username)) {
            totals.merge(e.getCategory(), e.getAmount(), Double::sum);
        }
        return totals;
    }
}