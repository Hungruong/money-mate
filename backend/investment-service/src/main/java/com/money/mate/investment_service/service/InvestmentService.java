package com.money.mate.investment_service.service;

import com.money.mate.investment_service.controller.InvestmentController;
import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.entity.Investment.InvestmentStatus;
import com.money.mate.investment_service.entity.Investment.InvestmentType;
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
import java.time.Instant;
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
                InvestmentStatus.active);
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

            // Set the required fields with appropriate values
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

            investment.setStatus(Investment.InvestmentStatus.active);
            logger.info("Set status: {}", Investment.InvestmentStatus.active);

            // Set the optional fields (using defaults or calculated values)
            investment.setAllocatedAmount(total); // Assuming allocatedAmount is the same as allocatedCapital
            logger.info("Set allocatedAmount: {}", total);

            investment.setCurrentValue(total); // Assuming currentValue starts as allocatedAmount (may be calculated
                                               // differently)
            logger.info("Set currentValue: {}", total);

            investment.setType(InvestmentType.manual); // Assuming this is the default, or you can change it to AUTO if
                                                       // needed
            logger.info("Set type: {}", InvestmentType.manual);

            investment.setStrategy(Investment.InvestmentStrategy.aggressive); // Assuming strategy starts as "value" or
                                                                              // you may want to set it
            // dynamically
            logger.info("Set strategy: {}", Investment.InvestmentStrategy.aggressive);

            // Log the newly created investment with all fields set
            logger.info("Created new investment: {}", investment);
        }

        logger.info("def");

        // saveInvestment(investment);
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
                InvestmentStatus.active);
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
                investment.setStatus(InvestmentStatus.closed);
            }

            investmentRepository.save(investment);

            Transactions transaction = new Transactions();
            transaction.setTransactionId(userId);
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

    public Investment saveInvestment(Investment investment) {

        try {
            // Log the investment details being saved
            logger.debug("Saving investment details: {}", investment);

            // Perform the save operation
            return investmentRepository.saveAndFlush(investment);
            // Log successful saving
        } catch (OptimisticLockingFailureException e) {
            // Log error in case of optimistic locking failure
            logger.error(
                    "Saving investment failed due to Optimistic Locking Failure: Investment ID = {}. Entity has been modified by another transaction.",
                    investment.getInvestmentId(), e);

            // Optionally, retry or handle the exception as needed
            throw new RuntimeException("Conflict detected. Please retry.", e);
        } catch (Exception e) {
            // Catch other potential exceptions and log them
            logger.error("Unexpected error while saving investment: Investment ID = {}", investment.getInvestmentId(),
                    e);
            throw new RuntimeException("Error while saving investment.", e);
        }

        // Final log after the save attempt (success or failure)
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