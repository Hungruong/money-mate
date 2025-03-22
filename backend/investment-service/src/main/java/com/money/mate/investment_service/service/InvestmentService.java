package com.money.mate.investment_service.service;

import com.money.mate.investment_service.controller.InvestmentController;
import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.entity.Investment.InvestmentStatus;
import com.money.mate.investment_service.entity.Investment.InvestmentType;
import com.money.mate.investment_service.entity.Transactions;
import com.money.mate.investment_service.entity.Transactions.TransactionType;
import java.util.List;
import com.money.mate.investment_service.repository.InvestmentRepository;
import com.money.mate.investment_service.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvestmentService {
    private static final Logger logger = LoggerFactory.getLogger(InvestmentController.class);

    @Autowired
    private final InvestmentRepository investmentRepository;

    @Autowired
    private final TransactionRepository transactionsRepository;

    @Autowired
    private final MarketDataService marketDataService; // Add MarketDataService dependency

    public List<Transactions> getTransactionsByUserId(UUID userId) {
        return transactionsRepository.findByUserId(userId);
    }

    @Transactional
    public void buyAsset(UUID userId, String symbol, BigDecimal quantity) {
        BigDecimal price = marketDataService.getCurrentStockPrice(symbol);
        BigDecimal total = quantity.multiply(price);
        Optional<Investment> existingInvestment = getInvestmentByUserIdSymbolStatus(userId, symbol,
                InvestmentStatus.active);
        Investment investment;

        logger.info("abc");

        if (existingInvestment.isPresent()) {
            investment = existingInvestment.get();
            investment.setTotalBoughtQuantity(investment.getTotalBoughtQuantity().add(quantity));
            investment.setCurrentQuantity(investment.getCurrentQuantity().add(quantity));
            investment.setAllocatedCapital(investment.getAllocatedCapital().add(total));
        } else {
            investment = new Investment();
            investment.setUserId(userId);
            logger.info("Set userId: {}", userId);
            investment.setSymbol(symbol);
            logger.info("Set symbol: {}", symbol);
            investment.setTotalBoughtQuantity(quantity);
            logger.info("Set totalBoughtQuantity: {}", quantity);
            investment.setTotalSoldQuantity(BigDecimal.ZERO);
            investment.setCurrentQuantity(quantity);
            logger.info("Set currentQuantity: {}", quantity);
            investment.setAllocatedCapital(total);
            logger.info("Set allocatedCapital: {}", total);
            investment.setAveragePrice(price);
            logger.info("Set averagePrice: {}", price);
            investment.setStatus(InvestmentStatus.active);
            logger.info("Set status: {}", InvestmentStatus.active);
            investment.setAllocatedAmount(total);
            logger.info("Set allocatedAmount: {}", total);
            investment.setCurrentValue(total); // Initial value
            logger.info("Set currentValue: {}", total);
            investment.setType(InvestmentType.manual);
            logger.info("Set type: {}", Investment.InvestmentType.manual);
            investment.setStrategy(Investment.InvestmentStrategy.aggressive);
            logger.info("Set strategy: {}", Investment.InvestmentStrategy.aggressive);
            logger.info("Created new investment: {}", investment);
        }

        logger.info("def");

        // Update current value based on latest market data
        updateInvestmentCurrentValue(investment);

        investment = investmentRepository.saveAndFlush(investment);

        logger.info("123");

        Transactions transaction = new Transactions();
        transaction.setInvestment(investment);
        transaction.setType(TransactionType.buy);
        transaction.setQuantity(quantity);
        transaction.setPrice(price);
        transaction.setTotalAmount(total);

        logger.info("456");

        saveTransaction(transaction);

        logger.info("789");
    }

    @Transactional
    public void sellAsset(UUID userId, String symbol, BigDecimal quantity) {
        BigDecimal price = marketDataService.getCurrentStockPrice(symbol);
        BigDecimal total = quantity.multiply(price);
        Optional<Investment> existingInvestment = getInvestmentByUserIdSymbolStatus(userId, symbol,
                InvestmentStatus.active);
        Investment investment;

        if (existingInvestment.isPresent()) {
            investment = existingInvestment.get();

            if (investment.getCurrentQuantity().compareTo(quantity) < 0) {
                throw new IllegalArgumentException("Not enough quantity to sell");
            }

            investment.setTotalSoldQuantity(investment.getTotalSoldQuantity().add(quantity));
            logger.info("Set totalSoldQuantity: {}", investment.getTotalSoldQuantity());
            investment.setCurrentQuantity(investment.getCurrentQuantity().subtract(quantity));
            logger.info("Set currentQuantity: {}", investment.getCurrentQuantity());
            investment.setAllocatedCapital(investment.getAllocatedCapital().subtract(total));
            logger.info("Set allocatedCapital: {}", investment.getAllocatedCapital());

            if (investment.getCurrentQuantity().compareTo(BigDecimal.ZERO) == 0) {
                investment.setStatus(InvestmentStatus.closed);
            }

            // Update current value based on latest market data
            updateInvestmentCurrentValue(investment);

            investment = investmentRepository.saveAndFlush(investment);

            Transactions transaction = new Transactions();
            transaction.setInvestment(investment);
            transaction.setType(TransactionType.sell);
            transaction.setQuantity(quantity);
            transaction.setPrice(price);
            transaction.setTotalAmount(total);

            transactionsRepository.save(transaction);
        } else {
            throw new IllegalArgumentException("No active investment found");
        }
    }

    @Transactional
    public Investment updateInvestmentCurrentValue(Investment investment) {
        try {
            BigDecimal currentPrice = marketDataService.getCurrentStockPrice(investment.getSymbol());
            BigDecimal newCurrentValue = investment.getCurrentQuantity().multiply(currentPrice);
            investment.setCurrentValue(newCurrentValue);
            logger.info("Updated currentValue for {} to {}", investment.getSymbol(), newCurrentValue);
            return investment;
        } catch (Exception e) {
            logger.error("Failed to update current value for symbol: {}", investment.getSymbol(), e);
            throw new RuntimeException("Error fetching market data", e);
        }
    }

    public Investment saveInvestment(Investment investment) {
        try {
            logger.debug("Saving investment details: {}", investment);
            return investmentRepository.saveAndFlush(investment);
        } catch (OptimisticLockingFailureException e) {
            logger.error(
                    "Saving investment failed due to Optimistic Locking Failure: Investment ID = {}. Entity has been modified by another transaction.",
                    investment.getInvestmentId(), e);
            throw new RuntimeException("Conflict detected. Please retry.", e);
        } catch (Exception e) {
            logger.error("Unexpected error while saving investment: Investment ID = {}", investment.getInvestmentId(),
                    e);
            throw new RuntimeException("Error while saving investment.", e);
        }
    }

    public void saveTransaction(Transactions transaction) {
        logger.info("Saving transaction: {}", transaction);
        try {
            transactionsRepository.save(transaction);
        } catch (OptimisticLockingFailureException e) {
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
        throw new UnsupportedOperationException("Unimplemented method 'getUserInvestments'");
    }

    // Optional: Method to update all investments periodically
    @Transactional
    public void updateAllInvestments() {
        investmentRepository.findAll().forEach(this::updateInvestmentCurrentValue);
        investmentRepository.saveAll(investmentRepository.findAll());
    }
}