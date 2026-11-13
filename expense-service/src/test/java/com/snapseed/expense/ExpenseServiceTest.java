package com.snapseed.expense;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class ExpenseServiceTest {

    @Autowired
    private ExpenseService service;

    @Autowired
    private BudgetService budgetService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    private String demoUsername;
    private String otherUsername;

    @BeforeEach
    void setup() {
        demoUsername = "demo";
        otherUsername = "testuser";

        // Create test user
        userRepository.findByUsername(otherUsername).orElseGet(() ->
                userRepository.save(new User(otherUsername, "password123")));
    }

    @Test
    void shouldStartWithFourSeedExpensesForDemoUser() {
        var all = service.getAll(demoUsername);

        assertThat(all).hasSize(4);
        assertThat(all.get(0).getDesc()).isEqualTo("Domino's Pizza"); // newest first
    }

    @Test
    void shouldAddExpenseWithDefaultPayment() {
        var request = new ExpenseRequest(LocalDate.parse("2026-08-20"), "Coffee", "food", 120.0, null);

        Expense saved = service.add(request, demoUsername);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getPayment()).isEqualTo("UPI");
        assertThat(service.getAll(demoUsername)).hasSize(5);
    }

    @Test
    void shouldThrowWhenExpenseDoesNotExist() {
        assertThatThrownBy(() -> service.getById(99, demoUsername))
                .isInstanceOf(ExpenseNotFoundException.class)
                .hasMessage("Expense 99 not found");
    }

    @Test
    void shouldDeleteExpense() {
        Long id = service.getAll(demoUsername).get(0).getId();

        service.delete(id, demoUsername);

        assertThat(service.getAll(demoUsername)).hasSize(3);
        assertThatThrownBy(() -> service.delete(id, demoUsername)).isInstanceOf(ExpenseNotFoundException.class);
    }

    @Test
    void shouldTotalByCategory() {
        assertThat(service.totalsByCategory(demoUsername))
                .containsEntry("food", 450.0)
                .containsEntry("utilities", 1200.0);
    }

    @Test
    void shouldUseMockedRepository() {
        ExpenseRepository mockRepo = Mockito.mock(ExpenseRepository.class);
        UserRepository mockUserRepo = Mockito.mock(UserRepository.class);
        Expense fake = new Expense(LocalDate.parse("2026-01-01"), "Mock item", "other", 10, "Cash");
        Mockito.when(mockRepo.findByIdAndOwnerUsername(7L, demoUsername)).thenReturn(Optional.of(fake));
        Mockito.when(mockUserRepo.findByUsername(demoUsername)).thenReturn(Optional.of(new User(demoUsername, "hash")));

        ExpenseService mockedService = new ExpenseService(mockRepo, mockUserRepo);

        assertThat(mockedService.getById(7, demoUsername).getDesc()).isEqualTo("Mock item");
    }

    @Test
    void userACreatesExpenseUserBFindAllDoesNotContainIt() {
        // User A creates an expense
        ExpenseRequest request = new ExpenseRequest(LocalDate.parse("2026-08-21"), "User A Expense", "food", 100.0, "Cash");
        service.add(request, demoUsername);

        // User B's findAll should not contain it
        var userBExpenses = service.getAll(otherUsername);
        assertThat(userBExpenses).noneMatch(e -> e.getDesc().equals("User A Expense"));

        // User A's findAll should contain it
        var userAExpenses = service.getAll(demoUsername);
        assertThat(userAExpenses).anyMatch(e -> e.getDesc().equals("User A Expense"));
    }

    @Test
    void newlyRegisteredUserHasZeroExpenses() {
        // Create a brand new user
        String newUser = "newuser" + System.currentTimeMillis();
        userRepository.save(new User(newUser, "password123"));

        var expenses = service.getAll(newUser);
        assertThat(expenses).isEmpty();
    }

    @Test
    void userBDeletingUserAExpenseThrowsNotFoundAndExpenseStillExists() {
        // User A creates an expense
        ExpenseRequest request = new ExpenseRequest(LocalDate.parse("2026-08-22"), "User A Secret", "food", 50.0, "Cash");
        Expense saved = service.add(request, demoUsername);
        Long expenseId = saved.getId();

        // User B tries to delete User A's expense - should throw not-found
        assertThatThrownBy(() -> service.delete(expenseId, otherUsername))
                .isInstanceOf(ExpenseNotFoundException.class);

        // The expense should still exist for User A
        var userAExpenses = service.getAll(demoUsername);
        assertThat(userAExpenses).anyMatch(e -> e.getId().equals(expenseId));
    }

    @Test
    void getBudgetsForNewUserReturnsSpentZeroWithCorrectLimits() {
        // Create a brand new user
        String newUser = "newuser" + System.currentTimeMillis();
        userRepository.save(new User(newUser, "password123"));

        // Get budget statuses for new user
        var statuses = budgetService.getAllStatuses(newUser);

        // Verify all 5 categories exist with correct limits
        assertThat(statuses).hasSize(5);

        // Check each category has correct limit and spent = 0
        for (var s : statuses) {
            assertThat(s.spent()).isEqualTo(0.0);
            if (s.category().equals("food")) assertThat(s.limit()).isEqualTo(5000.0);
            else if (s.category().equals("transport")) assertThat(s.limit()).isEqualTo(3000.0);
            else if (s.category().equals("shopping")) assertThat(s.limit()).isEqualTo(4000.0);
            else if (s.category().equals("utilities")) assertThat(s.limit()).isEqualTo(3000.0);
            else if (s.category().equals("other")) assertThat(s.limit()).isEqualTo(1000.0);
            assertThat(s.percent()).isEqualTo(0L);
            assertThat(s.status()).isEqualTo("ON_TRACK");
        }

        // Total limits should be 16000
        double totalLimits = statuses.stream().mapToDouble(BudgetStatus::limit).sum();
        assertThat(totalLimits).isEqualTo(16000.0);
    }

    @Test
    void demoUserStillHasExactlyItsSeededExpenses() {
        var all = service.getAll(demoUsername);
        assertThat(all).hasSize(4);

        var descs = all.stream().map(Expense::getDesc).toList();
        assertThat(descs).containsExactlyInAnyOrder(
                "Domino's Pizza",
                "Uber Ride",
                "Amazon Purchase",
                "Electricity Bill"
        );
    }
}