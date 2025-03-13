package com.money.mate.investment_service.service;

import com.money.mate.investment_service.controller.InvestmentController;
import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.entity.Investment.InvestmentStatus;
import com.money.mate.investment_service.entity.Transactions.TransactionType;
import com.money.mate.investment_service.entity.Transactions;
import com.money.mate.investment_service.repository.InvestmentRepository;
import com.money.mate.investment_service.repository.TransactionsRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Service // the controller method delegate actual business logic to the service
@RequiredArgsConstructor
public class InvestmentService {
    private static final Logger logger = LoggerFactory.getLogger(InvestmentController.class);
    @Autowired
    private final InvestmentRepository investmentRepository;
    @Autowired
    private final TransactionsRepository transactionsRepository;

    @Transactional
    public void buyAsset(UUID userId, String symbol, BigDecimal quantity, BigDecimal price) {
        BigDecimal total = quantity.multiply(price);
        Optional<Investment> existingInvestment = getInvestmentByUserIdSymbolStatus(userId, symbol,
                InvestmentStatus.ACTIVE);
        Investment investment;

        logger.info("abc");

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

        logger.info("def");

        saveInvestment(investment);

        logger.info("123");

        Transactions transaction = new Transactions();
        transaction.setTransactionId(UUID.randomUUID());
        transaction.setInvestment(investment);
        transaction.setType(TransactionType.BUY);
        transaction.setQuantity(quantity);
        transaction.setPrice(price);
        transaction.setTotalAmount(total);

        logger.info("456");

        saveTransaction(transaction);

        logger.info("789");
        try {
        } catch (Exception e) {
            logger.error("Transaction failed, marking rollback", e);
            throw new RuntimeException("Error processing investment transaction", e);
        }
    }

    @Transactional(noRollbackFor = Exception.class)
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

    public void saveInvestment(Investment investment) {
        logger.info("Saving investment: " + investment);
        try {
            investmentRepository.save(investment);
        } catch (OptimisticLockingFailureException e) {
            logger.error(
                    "Saving investment: Optimistic Locking Failure: Entity has been modified by another transaction",
                    e);
            // Optionally, retry the operation or inform the user
            throw new RuntimeException("Conflict detected. Please retry.", e);
        }
        logger.info("done saveInvestment");
    }

    public void saveTransaction(Transactions transaction) {
        logger.info("Saving transaction: " + transaction);
        try {
            transactionsRepository.save(transaction);
        } catch (OptimisticLockingFailureException e) {
            // Handle the conflict (e.g., reload the entity or notify the user)
            logger.error(
                    "Save Transaction: Optimistic Locking Failure: Entity has been modified by another transaction", e);
        }
        logger.info("done saveTransaction");
    }

    private Optional<Investment> getInvestmentByUserIdSymbolStatus(
            UUID userId, String symbol, InvestmentStatus status) {
        return investmentRepository.findByUserIdAndSymbolAndStatus(userId, symbol, status);
    }

    public Object getUserInvestments(UUID userId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUserInvestments'");
    }
}