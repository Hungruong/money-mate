package com.money.mate.investment_service.controller;

import com.money.mate.investment_service.entity.Transactions;
import com.money.mate.investment_service.service.TransactionService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:8081")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/user/{userId}")
    public List<Transactions> getTransactionsByUserId(@PathVariable UUID userId) {
        return transactionService.getTransactionsByUserId(userId);
    }
}