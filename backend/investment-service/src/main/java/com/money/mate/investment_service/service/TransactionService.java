package com.money.mate.investment_service.service;

import com.money.mate.investment_service.entity.Transaction;
import com.money.mate.investment_service.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public List<Transaction> getInvestmentTransactions(UUID investmentId) {
        return transactionRepository.findByInvestmentInvestmentId(investmentId);
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }
}
