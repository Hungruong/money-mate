package com.money.mate.investment_service.repository;

import com.money.mate.investment_service.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByInvestmentInvestmentId(UUID investmentId);
}
