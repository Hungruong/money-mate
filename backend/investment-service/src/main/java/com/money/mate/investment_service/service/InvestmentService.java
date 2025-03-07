package com.money.mate.investment_service.service;

import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.entity.Investment.InvestmentStatus;
import com.money.mate.investment_service.entity.Transactions.TransactionType;
import com.money.mate.investment_service.entity.Transactions;
import com.money.mate.investment_service.repository.InvestmentRepository;
import com.money.mate.investment_service.repository.TransactionsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Service // the controller method delegate actual business logic to the service
@RequiredArgsConstructor
public class InvestmentService {
    public void buyAsset(UUID userId, String symbol, BigDecimal quantity, BigDecimal price) {
        BigDecimal total = quantity.multiply(price);
        Optional<Investment> existingInvestment = getInvestmentByUserIdSymbolStatus(userId, symbol,
                InvestmentStatus.ACTIVE);
        Investment investment;

        if (existingInvestment.isPresent()) {
            investment = existingInvestment.get();
            investment.setTotalBoughtQuantity(investment.getTotalBoughtQuantity().add(quantity));
            investment.setCurrentQuantity(investment.getCurrentQuantity().add(quantity));
            investment.setAllocatedCapital(investment.getAllocatedCapital().add(total));
        } else {
            // Scenario 1 & 3: No active investment, create a new one
            investment = new Investment();
            investment.setInvestmentId(UUID.randomUUID());
            investment.setUserId(userId);
            investment.setSymbol(symbol);
            investment.setTotalBoughtQuantity(quantity);
            investment.setCurrentQuantity(quantity);
            investment.setAllocatedCapital(total);
            investment.setAveragePrice(price);
            investment.setStatus(InvestmentStatus.ACTIVE);
        }

        saveInvestment(investment);

        Transactions transaction = new Transactions();
        transaction.setTransactionId(userId);
        transaction.setInvestment(investment);
        transaction.setType(TransactionType.BUY);
        transaction.setQuantity(quantity);
        transaction.setPrice(price);
        transaction.setTotalAmount(total);

        transactionsRepository.save(transaction);
    }

    public void sellAsset(UUID userId, String symbol, BigDecimal quantity, BigDecimal price) {
        BigDecimal total = quantity.multiply(price);
        Optional<Investment> existingInvestment = getInvestmentByUserIdSymbolStatus(userId, symbol,
                InvestmentStatus.ACTIVE);
        Investment investment;

        if (existingInvestment.isPresent()) {
            investment = existingInvestment.get();

            if (investment.getCurrentQuantity().compareTo(quantity) < 0) {
                throw new IllegalArgumentException("Not enough quantity to sell");
            }

            investment.setTotalSoldQuantity(investment.getTotalSoldQuantity().add(quantity));
            investment.setCurrentQuantity(investment.getCurrentQuantity().subtract(quantity));
            investment.setAllocatedCapital(investment.getAllocatedCapital().subtract(total));

            if (investment.getCurrentQuantity().compareTo(BigDecimal.ZERO) == 0) {
                investment.setStatus(InvestmentStatus.CLOSED);
            }

            investmentRepository.save(investment);

            Transactions transaction = new Transactions();
            transaction.setTransactionId(userId);
            transaction.setInvestment(investment);
            transaction.setType(TransactionType.SELL);
            transaction.setQuantity(quantity);
            transaction.setPrice(price);
            transaction.setTotalAmount(total);

            transactionsRepository.save(transaction);
        } else {
            throw new IllegalArgumentException("No active investment found");
        }
    }

    private final InvestmentRepository investmentRepository;
    private final TransactionsRepository transactionsRepository;

    private void saveInvestment(Investment investment) {
        investmentRepository.save(investment);
    }

    private Optional<Investment> getInvestmentByUserIdSymbolStatus(
            UUID userId, String symbol, InvestmentStatus status) {
        return investmentRepository.findByUserIdAndSymbolAndStatus(userId, symbol, status);
    }
}