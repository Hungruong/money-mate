package com.money.mate.investment_service.service;

import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.entity.Investment.InvestmentStatus;
import com.money.mate.investment_service.entity.Investment.InvestmentType;
import com.money.mate.investment_service.entity.Transactions;
import com.money.mate.investment_service.entity.Transactions.TransactionType;
import com.money.mate.investment_service.repository.InvestmentRepository;
import com.money.mate.investment_service.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvestmentService {
    private static final Logger logger = LoggerFactory.getLogger(InvestmentService.class);
    private static final String USER_SERVICE_URL = "http://localhost:8082/api/users";
    private static final UUID HARDCODED_USER_ID = UUID.fromString("c2b1f449-7025-49a1-9933-67fcc5c35829");

    private final RestTemplate restTemplate;
    private final InvestmentRepository investmentRepository;
    private final TransactionRepository transactionsRepository;
    private final MarketDataService marketDataService;

    // Fetch user details from user-service
    public User getUserDetails(UUID userId) {
        try {
            String url = USER_SERVICE_URL + "/" + userId;
            return restTemplate.getForObject(url, User.class);
        } catch (Exception e) {
            logger.error("Error fetching user details for userId: {}", userId, e);
            throw new RuntimeException("Error fetching user details from User Service", e);
        }
    }

    public void updateUserAfterInvestment(UUID userId, double amount) {
        try {
            String url = USER_SERVICE_URL + "/" + userId + "/manual-trading-balance";
            UpdateUserRequest updateRequest = new UpdateUserRequest(userId, amount);
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            HttpEntity<UpdateUserRequest> entity = new HttpEntity<>(updateRequest, headers);
    
            logger.info("Sending PUT request to UserService - URL: {}, Payload: userId={}, amount={}", 
                        url, updateRequest.getUserId(), updateRequest.getAmount());
    
            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.PUT,
                    entity,
                    String.class
            );
    
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("UserService responded with success: {}", response.getBody());
            } else {
                logger.error("UserService responded with error: Status={}, Body={}", 
                            response.getStatusCode(), response.getBody());
                throw new RuntimeException("Failed to update user balance: " + response.getStatusCode());
            }
        } catch (HttpClientErrorException e) {
            logger.error("HTTP error calling UserService for userId: {}. Status: {}, Response: {}", 
                         userId, e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new RuntimeException("HTTP error updating user: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unexpected error updating user for userId: {}. Exception: {}", 
                         userId, e.getMessage(), e);
            throw new RuntimeException("Error updating user after investment", e);
        }
    }

    @Transactional
    public void buyAsset(UUID userId, String symbol, BigDecimal quantity) {
        BigDecimal price = marketDataService.getCurrentStockPrice(symbol);
        BigDecimal total = quantity.multiply(price);
        Optional<Investment> existingInvestment = getInvestmentByUserIdSymbolStatus(userId, symbol, InvestmentStatus.active);
        Investment investment;

        logger.info("Starting buyAsset for userId: {}, symbol: {}, quantity: {}", userId, symbol, quantity);

        User user = getUserDetails(userId);
        logger.info("Current manual trading balance for userId {}: {}", userId, user.getManualTradingBalance());
        if (user.getManualTradingBalance() < total.doubleValue()) {
            logger.error("Insufficient balance for userId: {}", userId);
            throw new IllegalArgumentException("Insufficient manual trading balance");
        }

        if (existingInvestment.isPresent()) {
            investment = existingInvestment.get();
            investment.setTotalBoughtQuantity(investment.getTotalBoughtQuantity().add(quantity));
            investment.setCurrentQuantity(investment.getCurrentQuantity().add(quantity));
            investment.setAllocatedCapital(investment.getAllocatedCapital().add(total));
        } else {
            investment = new Investment();
            investment.setUserId(userId);
            investment.setSymbol(symbol);
            investment.setTotalBoughtQuantity(quantity);
            investment.setTotalSoldQuantity(BigDecimal.ZERO);
            investment.setCurrentQuantity(quantity);
            investment.setAllocatedCapital(total);
            investment.setAveragePrice(price);
            investment.setStatus(InvestmentStatus.active);
            investment.setAllocatedAmount(total);
            investment.setCurrentValue(total);
            investment.setType(InvestmentType.manual);
            logger.info("Created new investment: {}", investment);
        }

        updateInvestmentCurrentValue(investment);
        investment = investmentRepository.saveAndFlush(investment);

        Transactions transaction = new Transactions();
        transaction.setInvestment(investment);
        transaction.setType(TransactionType.buy);
        transaction.setQuantity(quantity);
        transaction.setPrice(price);
        transaction.setTotalAmount(total);

        saveTransaction(transaction);
        logger.info("About to update user balance for userId: {}, amount: {}", userId, -total.doubleValue());
        updateUserAfterInvestment(userId, -total.doubleValue());
        logger.info("User balance update completed for userId: {}", userId);

        logger.info("Completed buyAsset for userId: {}, symbol: {}", userId, symbol);
    }

    // New method with hardcoded userId for demonstration
    @Transactional
    public void demoBuyAsset(String symbol, BigDecimal quantity) {
        buyAsset(HARDCODED_USER_ID, symbol, quantity);
        logger.info("Demo buyAsset completed for hardcoded userId: {}, symbol: {}, quantity: {}", 
                    HARDCODED_USER_ID, symbol, quantity);
    }

    @Transactional
    public void sellAsset(UUID userId, String symbol, BigDecimal quantity) {
        BigDecimal price = marketDataService.getCurrentStockPrice(symbol);
        BigDecimal total = quantity.multiply(price);
        Optional<Investment> existingInvestment = getInvestmentByUserIdSymbolStatus(userId, symbol, InvestmentStatus.active);

        if (existingInvestment.isPresent()) {
            Investment investment = existingInvestment.get();

            if (investment.getCurrentQuantity().compareTo(quantity) < 0) {
                throw new IllegalArgumentException("Not enough quantity to sell");
            }

            investment.setTotalSoldQuantity(investment.getTotalSoldQuantity().add(quantity));
            investment.setCurrentQuantity(investment.getCurrentQuantity().subtract(quantity));
            investment.setAllocatedCapital(investment.getAllocatedCapital().subtract(total));

            if (investment.getCurrentQuantity().compareTo(BigDecimal.ZERO) == 0) {
                investment.setStatus(InvestmentStatus.closed);
            }

            updateInvestmentCurrentValue(investment);
            investment = investmentRepository.saveAndFlush(investment);

            Transactions transaction = new Transactions();
            transaction.setInvestment(investment);
            transaction.setType(TransactionType.sell);
            transaction.setQuantity(quantity);
            transaction.setPrice(price);
            transaction.setTotalAmount(total);

            transactionsRepository.save(transaction);

            updateUserAfterInvestment(userId, total.doubleValue());
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
        } catch (Exception e) {
            logger.error("Unexpected error while saving investment: Investment ID = {}", investment.getInvestmentId(), e);
            throw new RuntimeException("Error while saving investment.", e);
        }
    }

    public void saveTransaction(Transactions transaction) {
        logger.info("Saving transaction: {}", transaction);
        try {
            transactionsRepository.save(transaction);
        } catch (Exception e) {
            logger.error("Unexpected error while saving transaction", e);
        }
        logger.info("Done saving transaction");
    }

    private Optional<Investment> getInvestmentByUserIdSymbolStatus(UUID userId, String symbol, InvestmentStatus status) {
        return investmentRepository.findByUserIdAndSymbolAndStatus(userId, symbol, status);
    }

    public List<Investment> getUserInvestments(UUID userId) {
        logger.info("Fetching investments for userId: {}", userId);
        List<Investment> investments = investmentRepository.findByUserId(userId);
        logger.info("Found {} investments for userId: {}", investments.size(), userId);
        return investments;
    }

    public List<Transactions> getTransactionsByUserId(UUID userId) {
        return transactionsRepository.findByUserId(userId);
    }

    @Transactional
    public void updateAllInvestments() {
        investmentRepository.findAll().forEach(this::updateInvestmentCurrentValue);
        investmentRepository.saveAll(investmentRepository.findAll());
    }

    // Inner class for REST request
    public static class UpdateUserRequest {
        private UUID userId;
        private double amount;

        public UpdateUserRequest(UUID userId, double amount) {
            this.userId = userId;
            this.amount = amount;
        }

        public UUID getUserId() { return userId; }
        public double getAmount() { return amount; }
    }

    // Inner class for User (minimal version for REST communication)
    public static class User {
        private double manualTradingBalance;

        public double getManualTradingBalance() { return manualTradingBalance; }
        public void setManualTradingBalance(double manualTradingBalance) { this.manualTradingBalance = manualTradingBalance; }
    }
}