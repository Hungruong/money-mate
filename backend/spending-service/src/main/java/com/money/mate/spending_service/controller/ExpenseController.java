package com.money.mate.spending_service.controller;

import com.money.mate.spending_service.entity.Expense;
import com.money.mate.spending_service.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/spending")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.saveExpense(expense));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Expense>> getUserExpenses(@PathVariable UUID userId) {
        return ResponseEntity.ok(expenseService.getUserExpenses(userId));
    }

    @GetMapping("/expense/{expenseId}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable UUID expenseId) {
        return expenseService.getExpenseById(expenseId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{expenseId}")
    public ResponseEntity<Expense> updateExpense(@PathVariable UUID expenseId, @RequestBody Expense updatedExpense) {
        return ResponseEntity.ok(expenseService.updateExpense(expenseId, updatedExpense));
    }

    @DeleteMapping("/{expenseId}")
    public ResponseEntity<String> deleteExpense(@PathVariable UUID expenseId) {
        expenseService.deleteExpense(expenseId);
        return ResponseEntity.ok("Expense deleted successfully.");
    }
}
