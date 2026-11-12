package com.snapseed.expense;

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

    @Test
    void shouldStartWithFourSeedExpenses() {
        var all = service.getAll();

        assertThat(all).hasSize(4);
        assertThat(all.get(0).getDesc()).isEqualTo("Domino's Pizza"); // newest first
    }

    @Test
    void shouldAddExpenseWithDefaultPayment() {
        var request = new ExpenseRequest(LocalDate.parse("2026-08-20"), "Coffee", "food", 120.0, null);

        Expense saved = service.add(request);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getPayment()).isEqualTo("UPI");
        assertThat(service.getAll()).hasSize(5);
    }

    @Test
    void shouldThrowWhenExpenseDoesNotExist() {
        assertThatThrownBy(() -> service.getById(99))
                .isInstanceOf(ExpenseNotFoundException.class)
                .hasMessage("Expense 99 not found");
    }

    @Test
    void shouldDeleteExpense() {
        Long id = service.getAll().get(0).getId();

        service.delete(id);

        assertThat(service.getAll()).hasSize(3);
        assertThatThrownBy(() -> service.delete(id)).isInstanceOf(ExpenseNotFoundException.class);
    }

    @Test
    void shouldTotalByCategory() {
        assertThat(service.totalsByCategory())
                .containsEntry("food", 450.0)
                .containsEntry("utilities", 1200.0);
    }

    @Test
    void shouldUseMockedRepository() {
        ExpenseRepository mockRepo = Mockito.mock(ExpenseRepository.class);
        Expense fake = new Expense(LocalDate.parse("2026-01-01"), "Mock item", "other", 10, "Cash");
        Mockito.when(mockRepo.findById(7L)).thenReturn(Optional.of(fake));

        ExpenseService mockedService = new ExpenseService(mockRepo);

        assertThat(mockedService.getById(7).getDesc()).isEqualTo("Mock item");
    }
}