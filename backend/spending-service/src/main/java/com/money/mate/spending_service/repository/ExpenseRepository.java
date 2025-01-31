package com.money.mate.spending_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.money.mate.spending_service.entity.Expense;
import java.util.List;
import java.util.UUID;

public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
    List<Expense> findByUserId(UUID userId);
}
