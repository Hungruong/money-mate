package com.money.mate.investment_service.service;

import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.entity.Investment.InvestmentStatus;
import com.money.mate.investment_service.entity.Investment.InvestmentStrategy;
import com.money.mate.investment_service.entity.Investment.InvestmentType;
import com.money.mate.investment_service.entity.Transactions;
import com.money.mate.investment_service.entity.Transactions.TransactionType;
import com.money.mate.investment_service.repository.InvestmentRepository;
import com.money.mate.investment_service.repository.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class AutoTradingService {
    private static final Logger logger = LoggerFactory.getLogger(AutoTradingService.class);

    @Autowired
    private InvestmentRepository investmentRepository;
    @Autowired
    private TransactionRepository transactionsRepository;
    @Autowired
    private MarketDataService marketDataService;
    @Autowired(required = false)
    private NotificationService notificationService;
    @Autowired
    private RestTemplate restTemplate;

    private static final String USER_SERVICE_URL = "http://localhost:8082/api/users"; // Adjust URL as needed
    private static final List<String> SAFE_STOCKS = List.of("AAPL", "MSFT", "AMZN", "GOOGL", "NFLX", "DIS", "JPM", "NKE", "WMT", "JNJ");
    private static final List<String> MODERATE_STOCKS = List.of("AAPL", "MSFT", "GOOGL", "JNJ", "V", "WMT", "HD", "COST", "PEP", "NKE", "SQ", "SHOP", "PYPL", "AMD", "CRM");
    private static final List<String> AGGRESSIVE_STOCKS = List.of("TSLA", "NVDA", "META", "PLTR", "SNOW", "COIN", "RBLX", "UPST");
    private static final long ONE_MONTH_SECONDS = 30L * 24 * 60 * 60;

    @Transactional
    public Investment startStrategy(UUID userId, InvestmentStrategy strategy, BigDecimal allocatedAmount) {
        logger.info("Starting strategy for userId: {}, strategy: {}, amount: {}", userId, strategy, allocatedAmount);

        // Deduct from user's auto-trading balance via REST call
        double amountDouble = allocatedAmount.doubleValue();
        updateAutoTradingBalance(userId, -amountDouble);

        List<Investment> existingInvestments = investmentRepository.findByUserIdAndType(userId, InvestmentType.auto);
        if (existingInvestments.stream().anyMatch(inv -> inv.getStatus() == InvestmentStatus.active)) {
            throw new IllegalStateException("User already has an active auto-trading strategy.");
        }

        String symbol = selectInitialStock(strategy);
        Investment investment = createInvestment(userId, symbol, allocatedAmount, strategy);
        investment = investmentRepository.save(investment);

        BigDecimal price = marketDataService.getCurrentStockPrice(symbol);
        BigDecimal quantity = allocatedAmount.divide(price, 4, BigDecimal.ROUND_HALF_UP);
        buyAsset(investment, price, quantity);
        investmentRepository.save(investment);

        return investment;
    }

    private void updateAutoTradingBalance(UUID userId, double amount) {
        String url = USER_SERVICE_URL + "/" + userId + "/auto-trading-balance";
        HttpEntity<UpdateUserRequest> request = new HttpEntity<>(new UpdateUserRequest(userId, amount));
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, request, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            logger.error("Failed to update auto-trading balance for userId: {}. Status: {}", userId, response.getStatusCode());
            throw new IllegalStateException("Failed to update auto-trading balance: " + response.getStatusCode());
        }
        logger.info("Successfully updated auto-trading balance for userId: {} by amount: {}", userId, amount);
    }

    private String selectInitialStock(InvestmentStrategy strategy) {
        List<String> pool = switch (strategy) {
            case conservative -> SAFE_STOCKS;
            case moderate -> MODERATE_STOCKS;
            case aggressive -> AGGRESSIVE_STOCKS;
        };
        return pool.get(new Random().nextInt(pool.size()));
    }

    private Investment createInvestment(UUID userId, String symbol, BigDecimal capital, InvestmentStrategy strategy) {
        Investment investment = new Investment();
        investment.setUserId(userId);
        investment.setSymbol(symbol);
        investment.setAllocatedAmount(capital);
        investment.setTotalBoughtQuantity(BigDecimal.ZERO);
        investment.setTotalSoldQuantity(BigDecimal.ZERO);
        investment.setCurrentQuantity(BigDecimal.ZERO);
        investment.setAveragePrice(BigDecimal.ZERO);
        investment.setAllocatedCapital(capital);
        investment.setCurrentValue(BigDecimal.ZERO);
        investment.setType(InvestmentType.auto);
        investment.setStrategy(strategy);
        investment.setStatus(InvestmentStatus.active);
        return investment;
    }

    private void buyAsset(Investment investment, BigDecimal price, BigDecimal quantity) {
        BigDecimal total = price.multiply(quantity);
        investment.setTotalBoughtQuantity(investment.getTotalBoughtQuantity().add(quantity));
        investment.setCurrentQuantity(investment.getCurrentQuantity().add(quantity));
        investment.setAveragePrice(price); // Simplified; consider weighted average for multiple buys
        investment.setAllocatedCapital(total);
        investment.setCurrentValue(total);

        Transactions transaction = new Transactions();
        transaction.setInvestment(investment);
        transaction.setType(TransactionType.buy);
        transaction.setQuantity(quantity);
        transaction.setPrice(price);
        transaction.setTotalAmount(total);
        transactionsRepository.save(transaction);
    }

    private void sellAsset(Investment investment, BigDecimal price, BigDecimal quantity) {
        BigDecimal total = price.multiply(quantity);
        investment.setTotalSoldQuantity(investment.getTotalSoldQuantity().add(quantity));
        investment.setCurrentQuantity(investment.getCurrentQuantity().subtract(quantity));
        investment.setCurrentValue(price.multiply(investment.getCurrentQuantity()));

        Transactions transaction = new Transactions();
        transaction.setInvestment(investment);
        transaction.setType(TransactionType.sell);
        transaction.setQuantity(quantity);
        transaction.setPrice(price);
        transaction.setTotalAmount(total);
        transactionsRepository.save(transaction);

        // Credit proceeds to user's auto-trading balance via REST call
        double proceeds = total.doubleValue();
        updateAutoTradingBalance(investment.getUserId(), proceeds);

        checkAndCloseIfSoldOut(investment.getUserId());
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    @Transactional
    public void checkActiveStrategies() {
        List<Investment> investments = investmentRepository.findByStatusAndType(InvestmentStatus.active, InvestmentType.auto);
        for (Investment investment : investments) {
            long checkInterval = getCheckInterval(investment.getStrategy());
            long timeSinceLastUpdate = Instant.now().getEpochSecond() - investment.getUpdatedAt().getEpochSecond() * 1000;
            if (timeSinceLastUpdate >= checkInterval) {
                evaluatePosition(investment, true); // Allow trading for active
                checkStrategyTermination(investment.getUserId());
            }
        }
    }

    @Scheduled(fixedRate = 5 * 60 * 1000)
    @Transactional
    public void checkPausedStrategies() {
        List<Investment> pausedInvestments = investmentRepository.findByStatusAndType(InvestmentStatus.paused, InvestmentType.auto);
        for (Investment investment : pausedInvestments) {
            long checkInterval = getCheckInterval(investment.getStrategy());
            long timeSinceLastUpdate = Instant.now().getEpochSecond() - investment.getUpdatedAt().getEpochSecond() * 1000;
            if (timeSinceLastUpdate >= checkInterval) {
                evaluatePosition(investment, false); // Monitor only for paused
                checkStrategyTermination(investment.getUserId());
            }
        }
    }

    private long getCheckInterval(InvestmentStrategy strategy) {
        return switch (strategy) {
            case conservative -> 60 * 60 * 1000L;
            case moderate -> 15 * 60 * 1000L;
            case aggressive -> 5 * 60 * 1000L;
        };
    }

    private void evaluatePosition(Investment investment, boolean allowTrading) {
        if (investment.getCurrentQuantity().compareTo(BigDecimal.ZERO) == 0) return;

        BigDecimal currentPrice = marketDataService.getCurrentStockPrice(investment.getSymbol());
        investment.setCurrentValue(currentPrice.multiply(investment.getCurrentQuantity()));
        investmentRepository.save(investment);

        if (allowTrading) {
            BigDecimal profitPercentage = calculateProfitPercentage(investment, currentPrice);
            BigDecimal lossPercentage = calculateLossPercentage(investment, currentPrice);
            Thresholds thresholds = getThresholds(investment.getStrategy());

            if (profitPercentage.compareTo(thresholds.profitThresholdMax) >= 0 ||
                    lossPercentage.compareTo(thresholds.lossThresholdMax) >= 0 ||
                    isMaxHoldingPeriodExceeded(investment)) {
                sellAndReinvest(investment, currentPrice);
            }
        }
    }

    private void sellAndReinvest(Investment investment, BigDecimal currentPrice) {
        sellAsset(investment, currentPrice, investment.getCurrentQuantity());
        BigDecimal proceeds = currentPrice.multiply(investment.getTotalBoughtQuantity());
        String newSymbol = selectInitialStock(investment.getStrategy());
        Investment newInvestment = createInvestment(investment.getUserId(), newSymbol, proceeds, investment.getStrategy());
        newInvestment = investmentRepository.save(newInvestment);
        BigDecimal newPrice = marketDataService.getCurrentStockPrice(newSymbol);
        BigDecimal newQuantity = proceeds.divide(newPrice, 4, BigDecimal.ROUND_HALF_UP);
        buyAsset(newInvestment, newPrice, newQuantity);
        investmentRepository.save(newInvestment);
    }

    private void checkStrategyTermination(UUID userId) {
        List<Investment> investments = investmentRepository.findByUserIdAndType(userId, InvestmentType.auto);
        if (investments.isEmpty()) return;

        BigDecimal totalCapital = investments.stream()
                .map(Investment::getAllocatedCapital)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalValue = investments.stream()
                .map(Investment::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal overallReturn = totalCapital.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ZERO
                : totalValue.subtract(totalCapital).divide(totalCapital, 4, BigDecimal.ROUND_HALF_UP)
                        .multiply(BigDecimal.valueOf(100));
        InvestmentStrategy strategy = investments.get(0).getStrategy();
        Thresholds thresholds = getThresholds(strategy);

        if (overallReturn.compareTo(thresholds.targetReturn) >= 0 && notificationService != null) {
            notificationService.notifyUser(userId.toString(),
                    "Target return of " + thresholds.targetReturn + "% achieved for " + strategy + " strategy.");
        }

        BigDecimal lossThreshold = switch (strategy) {
            case conservative -> new BigDecimal("-10");
            case moderate -> new BigDecimal("-15");
            case aggressive -> new BigDecimal("-20");
        };
        if (overallReturn.compareTo(lossThreshold) <= 0) {
            stopStrategy(userId);
            if (notificationService != null) {
                notificationService.notifyUser(userId.toString(),
                        "Overall loss threshold exceeded for " + strategy + " strategy. Trading stopped.");
            }
        }

        Instant earliestStart = investments.stream()
                .map(Investment::getCreatedAt)
                .min(Instant::compareTo)
                .orElse(Instant.now());
        if ((Instant.now().getEpochSecond() - earliestStart.getEpochSecond()) >= ONE_MONTH_SECONDS
                && notificationService != null) {
            notificationService.notifyUser(userId.toString(),
                    "1-month duration reached for " + strategy + " strategy. Please decide next steps.");
        }
    }

    @Transactional
    public void pauseStrategy(UUID userId) {
        List<Investment> investments = investmentRepository.findByUserIdAndType(userId, InvestmentType.auto);
        if (investments.isEmpty()) {
            throw new IllegalStateException("No auto-trading strategy found for user: " + userId);
        }
        investments.forEach(inv -> inv.setStatus(InvestmentStatus.paused));
        investmentRepository.saveAll(investments);
    }

    @Transactional
    public void stopStrategy(UUID userId) {
        List<Investment> investments = investmentRepository.findByUserIdAndType(userId, InvestmentType.auto);
        if (investments.isEmpty()) {
            throw new IllegalStateException("No auto-trading strategy found for user: " + userId);
        }
        investments.forEach(inv -> inv.setStatus(InvestmentStatus.stopped));
        investmentRepository.saveAll(investments);
    }

    @Transactional
    public void resumeStrategy(UUID userId) {
        List<Investment> investments = investmentRepository.findByUserIdAndType(userId, InvestmentType.auto);
        if (investments.isEmpty()) {
            throw new IllegalStateException("No auto-trading strategy found to resume for user: " + userId);
        }
        if (investments.stream().anyMatch(inv -> inv.getStatus() == InvestmentStatus.active)) {
            throw new IllegalStateException("An active strategy already exists for user: " + userId);
        }
        investments.forEach(inv -> inv.setStatus(InvestmentStatus.active));
        investmentRepository.saveAll(investments);
    }

    @Transactional
    public void closeStrategy(UUID userId) {
        List<Investment> investments = investmentRepository.findByUserIdAndType(userId, InvestmentType.auto);
        if (investments.isEmpty()) {
            throw new IllegalStateException("No auto-trading strategy found for user: " + userId);
        }
        if (investments.stream().anyMatch(inv -> inv.getCurrentQuantity().compareTo(BigDecimal.ZERO) > 0)) {
            throw new IllegalStateException("Cannot close strategy with open positions. Sell all positions first.");
        }
        investments.forEach(inv -> inv.setStatus(InvestmentStatus.closed));
        investmentRepository.saveAll(investments);
    }

    @Transactional
    public void manualSell(UUID userId, String symbol, BigDecimal quantity) {
        List<Investment> investments = investmentRepository.findByUserIdAndType(userId, InvestmentType.auto);
        Investment investment = investments.stream()
                .filter(inv -> inv.getSymbol().equals(symbol) &&
                        (inv.getStatus() == InvestmentStatus.paused || inv.getStatus() == InvestmentStatus.stopped))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No paused or stopped investment found for symbol: " + symbol));

        if (quantity.compareTo(investment.getCurrentQuantity()) > 0) {
            throw new IllegalArgumentException("Cannot sell more than current quantity: " + investment.getCurrentQuantity());
        }

        BigDecimal currentPrice = marketDataService.getCurrentStockPrice(symbol);
        sellAsset(investment, currentPrice, quantity);
        investmentRepository.save(investment);
    }

    private void checkAndCloseIfSoldOut(UUID userId) {
        List<Investment> investments = investmentRepository.findByUserIdAndType(userId, InvestmentType.auto);
        boolean allSold = investments.stream()
                .allMatch(inv -> inv.getCurrentQuantity().compareTo(BigDecimal.ZERO) == 0);
        if (allSold && investments.stream().anyMatch(inv -> inv.getStatus() == InvestmentStatus.stopped)) {
            investments.forEach(inv -> inv.setStatus(InvestmentStatus.closed));
            investmentRepository.saveAll(investments);
            if (notificationService != null) {
                notificationService.notifyUser(userId.toString(), "All positions sold. Strategy closed.");
            }
        }
    }

    private BigDecimal calculateProfitPercentage(Investment investment, BigDecimal currentPrice) {
        if (investment.getAveragePrice().compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return currentPrice.subtract(investment.getAveragePrice())
                .divide(investment.getAveragePrice(), 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    private BigDecimal calculateLossPercentage(Investment investment, BigDecimal currentPrice) {
        if (investment.getAveragePrice().compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return investment.getAveragePrice().subtract(currentPrice)
                .divide(investment.getAveragePrice(), 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    private boolean isMaxHoldingPeriodExceeded(Investment investment) {
        long daysHeld = (Instant.now().getEpochSecond() - investment.getCreatedAt().getEpochSecond()) / (24 * 60 * 60);
        return daysHeld >= switch (investment.getStrategy()) {
            case conservative -> 30;
            case moderate -> 10;
            case aggressive -> 5;
        };
    }

    private Thresholds getThresholds(InvestmentStrategy strategy) {
        return switch (strategy) {
            case conservative -> new Thresholds(new BigDecimal("5"), new BigDecimal("10"), new BigDecimal("3"), new BigDecimal("5"), new BigDecimal("15"));
            case moderate -> new Thresholds(new BigDecimal("8"), new BigDecimal("15"), new BigDecimal("5"), new BigDecimal("8"), new BigDecimal("20"));
            case aggressive -> new Thresholds(new BigDecimal("15"), new BigDecimal("25"), new BigDecimal("10"), new BigDecimal("15"), new BigDecimal("25"));
        };
    }

    private record Thresholds(BigDecimal profitThresholdMin, BigDecimal profitThresholdMax,
                             BigDecimal lossThresholdMin, BigDecimal lossThresholdMax,
                             BigDecimal targetReturn) {
    }

    public List<Investment> getInvestmentsByUserId(UUID userId) {
        logger.info("Retrieving investments for userId: {}", userId);
        List<Investment> investments = investmentRepository.findByUserId(userId);
        return investments;
    }

    // DTO for REST request
    private static class UpdateUserRequest {
        private UUID userId;
        private double amount;

        public UpdateUserRequest(UUID userId, double amount) {
            this.userId = userId;
            this.amount = amount;
        }

        public UUID getUserId() { return userId; }
        public void setUserId(UUID userId) { this.userId = userId; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
    }
}