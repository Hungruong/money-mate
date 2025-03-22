package com.money.mate.investment_service.service;

import com.money.mate.investment_service.entity.Transactions;
import com.money.mate.investment_service.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    public List<Transactions> getTransactionsByUserId(UUID userId) {
        return transactionRepository.findByUserId(userId);
    }
}