package com.money.mate.investment_service.repository;

import com.money.mate.investment_service.entity.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TransactionsRepository extends JpaRepository<Transactions, UUID> {
    
    
}
