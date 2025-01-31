package com.money.mate.spending_service.service;

import com.money.mate.spending_service.entity.Expense;
import com.money.mate.spending_service.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public Expense saveExpense(Expense expense) {
        return expenseRepository.save(expense);
    }

    public List<Expense> getUserExpenses(UUID userId) {
        return expenseRepository.findByUserId(userId);
    }

    public Optional<Expense> getExpenseById(UUID expenseId) {
        return expenseRepository.findById(expenseId);
    }

    public Expense updateExpense(UUID expenseId, Expense updatedExpense) {
        return expenseRepository.findById(expenseId).map(expense -> {
            expense.setAmount(updatedExpense.getAmount());
            expense.setCategory(updatedExpense.getCategory());
            expense.setType(updatedExpense.getType());
            expense.setDescription(updatedExpense.getDescription());
            expense.setReceiptUrl(updatedExpense.getReceiptUrl());
            return expenseRepository.save(expense);
        }).orElseThrow(() -> new RuntimeException("Expense not found."));
    }

    public void deleteExpense(UUID expenseId) {
        expenseRepository.deleteById(expenseId);
    }
}
