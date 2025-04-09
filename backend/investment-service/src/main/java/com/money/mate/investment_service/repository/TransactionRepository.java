package com.money.mate.investment_service.repository;

import com.money.mate.investment_service.entity.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transactions, UUID> {
    @Query("SELECT t FROM Transactions t WHERE t.investment.userId = :userId")
    List<Transactions> findByUserId(@Param("userId") UUID userId);
}