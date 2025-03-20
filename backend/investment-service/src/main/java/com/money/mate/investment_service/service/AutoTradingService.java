package com.money.mate.investment_service.service;

import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.entity.Investment.InvestmentStatus;
import com.money.mate.investment_service.entity.Investment.InvestmentStrategy;
import com.money.mate.investment_service.entity.Investment.InvestmentType;
import com.money.mate.investment_service.entity.Transactions;
import com.money.mate.investment_service.entity.Transactions.TransactionType;
import com.money.mate.investment_service.repository.InvestmentRepository;
import com.money.mate.investment_service.repository.TransactionsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AutoTradingService {
    private static final Logger logger = LoggerFactory.getLogger(AutoTradingService.class);

    @Autowired
    private InvestmentRepository investmentRepository;

    @Autowired
    private TransactionsRepository transactionsRepository;

    @Autowired
    private MarketDataService marketDataService;
    
    @Autowired
    private NotificationService notificationService; // Placeholder for notifications

    // Stock pools (simplified for demo)
    private static final List<String> SAFE_STOCKS = List.of("AAPL", "MSFT", "AMZN", "GOOGL", "JNJ", "PG", "KO", "V", "WMT", "DIS");
    private static final List<String> MODERATE_CORE = List.of("AAPL", "MSFT", "GOOGL", "JNJ", "V", "WMT", "HD", "COST", "PEP", "NKE");
    private static final List<String> MODERATE_GROWTH = List.of("SQ", "SHOP", "PYPL", "AMD", "CRM", "ETSY", "ROKU");
    private static final List<String> AGGRESSIVE_STOCKS = List.of("TSLA", "NVDA", "META", "PLTR", "SNOW", "COIN", "RBLX", "UPST");

    private static final long ONE_MONTH_SECONDS = 30L * 24 * 60 * 60; // 1 month in seconds

    // Start a new auto-trading strategy
    @Transactional
    public List<Investment> startStrategy(UUID userId, InvestmentStrategy strategy, BigDecimal totalCapital) {
        List<Investment> investments = allocateCapital(userId, strategy, totalCapital);
        for (Investment investment : investments) {
            BigDecimal price = marketDataService.getCurrentStockPrice(investment.getSymbol());
            BigDecimal quantity = investment.getAllocatedCapital().divide(price, 4, BigDecimal.ROUND_HALF_UP);
            buyAsset(investment, price, quantity);
            investmentRepository.save(investment);
        }
        return investments;
    }

    // Allocate capital based on strategy
    private List<Investment> allocateCapital(UUID userId, InvestmentStrategy strategy, BigDecimal totalCapital) {
        List<Investment> investments = new ArrayList<>();
        switch (strategy) {
            case conservative -> {
                BigDecimal perStock = totalCapital.divide(BigDecimal.TEN, 2, BigDecimal.ROUND_HALF_UP);
                for (String symbol : SAFE_STOCKS) {
                    investments.add(createInvestment(userId, symbol, perStock, strategy));
                }
            }
            case moderate -> {
                BigDecimal coreCapital = totalCapital.multiply(new BigDecimal("0.6"));
                BigDecimal growthCapital = totalCapital.multiply(new BigDecimal("0.4"));
                BigDecimal corePerStock = coreCapital.divide(new BigDecimal("8"), 2, BigDecimal.ROUND_HALF_UP);
                BigDecimal growthPerStock = growthCapital.divide(new BigDecimal("5"), 2, BigDecimal.ROUND_HALF_UP);
                for (int i = 0; i < 8; i++) investments.add(createInvestment(userId, MODERATE_CORE.get(i), corePerStock, strategy));
                for (int i = 0; i < 5; i++) investments.add(createInvestment(userId, MODERATE_GROWTH.get(i), growthPerStock, strategy));
            }
            case aggressive -> {
                BigDecimal topPick = totalCapital.multiply(new BigDecimal("0.3"));
                BigDecimal midTier = totalCapital.multiply(new BigDecimal("0.5")).divide(new BigDecimal("4"), 2, BigDecimal.ROUND_HALF_UP);
                BigDecimal emerging = totalCapital.multiply(new BigDecimal("0.2")).divide(new BigDecimal("4"), 2, BigDecimal.ROUND_HALF_UP);
                investments.add(createInvestment(userId, AGGRESSIVE_STOCKS.get(0), topPick, strategy));
                for (int i = 1; i < 5; i++) investments.add(createInvestment(userId, AGGRESSIVE_STOCKS.get(i), midTier, strategy));
                for (int i = 5; i < 8; i++) investments.add(createInvestment(userId, AGGRESSIVE_STOCKS.get(i), emerging, strategy));
            }
        }
        return investments;
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

    // Buy logic for auto-trading
    private void buyAsset(Investment investment, BigDecimal price, BigDecimal quantity) {
        BigDecimal total = price.multiply(quantity);
        investment.setTotalBoughtQuantity(quantity);
        investment.setCurrentQuantity(quantity);
        investment.setAveragePrice(price);
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

    // Sell logic for auto-trading
    private void sellAsset(Investment investment, BigDecimal price) {
        BigDecimal quantity = investment.getCurrentQuantity();
        BigDecimal total = price.multiply(quantity);
        investment.setTotalSoldQuantity(investment.getTotalSoldQuantity().add(quantity));
        investment.setCurrentQuantity(BigDecimal.ZERO);
        investment.setCurrentValue(BigDecimal.ZERO);
        investment.setStatus(InvestmentStatus.closed);

        Transactions transaction = new Transactions();
        transaction.setInvestment(investment);
        transaction.setType(TransactionType.sell);
        transaction.setQuantity(quantity);
        transaction.setPrice(price);
        transaction.setTotalAmount(total);
        transactionsRepository.save(transaction);
    }

    // Scheduled price checks
    @Scheduled(fixedRate = 60 * 60 * 1000) // Safe: 60 minutes
    @Transactional
    public void checkSafeStrategy() {
        processStrategy(InvestmentStrategy.conservative);
    }

    @Scheduled(fixedRate = 15 * 60 * 1000) // Moderate: 15 minutes
    @Transactional
    public void checkModerateStrategy() {
        processStrategy(InvestmentStrategy.moderate);
    }

    @Scheduled(fixedRate = 5 * 60 * 1000) // Aggressive: 5 minutes
    @Transactional
    public void checkAggressiveStrategy() {
        processStrategy(InvestmentStrategy.aggressive);
    }

    private void processStrategy(InvestmentStrategy strategy) {
        List<Investment> investments = investmentRepository.findByStrategyAndStatusAndType(
                strategy, InvestmentStatus.active, InvestmentType.auto);
        for (Investment investment : investments) {
            evaluatePosition(investment);
            checkStrategyTermination(investment.getUserId());
        }
    }

    private void evaluatePosition(Investment investment) {
        if (investment.getCurrentQuantity().compareTo(BigDecimal.ZERO) == 0) return;

        BigDecimal currentPrice = marketDataService.getCurrentStockPrice(investment.getSymbol());
        investment.setCurrentValue(currentPrice.multiply(investment.getCurrentQuantity()));
        investmentRepository.save(investment);

        BigDecimal profitPercentage = calculateProfitPercentage(investment, currentPrice);
        BigDecimal lossPercentage = calculateLossPercentage(investment, currentPrice);
        Thresholds thresholds = getThresholds(investment.getStrategy());

        if (profitPercentage.compareTo(thresholds.profitThresholdMax) >= 0 ||
            lossPercentage.compareTo(thresholds.lossThresholdMax) >= 0 ||
            isMaxHoldingPeriodExceeded(investment)) {
            sellAndReinvest(investment, currentPrice);
        }
    }

    private void sellAndReinvest(Investment investment, BigDecimal currentPrice) {
        sellAsset(investment, currentPrice);
        BigDecimal proceeds = currentPrice.multiply(investment.getTotalBoughtQuantity()); // Proceeds from sale
        String newSymbol = selectNewStock(investment.getStrategy());
        Investment newInvestment = createInvestment(investment.getUserId(), newSymbol, proceeds, investment.getStrategy());
        BigDecimal newPrice = marketDataService.getCurrentStockPrice(newSymbol);
        BigDecimal newQuantity = proceeds.divide(newPrice, 4, BigDecimal.ROUND_HALF_UP);
        buyAsset(newInvestment, newPrice, newQuantity);
        investmentRepository.save(newInvestment);
    }

    private String selectNewStock(InvestmentStrategy strategy) {
        List<String> pool = switch (strategy) {
            case conservative -> SAFE_STOCKS;
            case moderate -> new ArrayList<>(MODERATE_GROWTH); // Could mix core/growth
            case aggressive -> AGGRESSIVE_STOCKS;
        };
        return pool.get(new Random().nextInt(pool.size()));
    }

    private void checkStrategyTermination(UUID userId) {
        List<Investment> investments = investmentRepository.findByUserIdAndType(userId, InvestmentType.auto);
        BigDecimal totalCapital = investments.stream()
                .map(Investment::getAllocatedCapital)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalValue = investments.stream()
                .map(Investment::getCurrentValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal overallReturn = totalCapital.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ZERO :
                totalValue.subtract(totalCapital).divide(totalCapital, 4, BigDecimal.ROUND_HALF_UP).multiply(BigDecimal.valueOf(100));
        InvestmentStrategy strategy = investments.get(0).getStrategy();
        Thresholds thresholds = getThresholds(strategy);

        if (overallReturn.compareTo(thresholds.targetReturn) >= 0) {
            notificationService.notifyUser(userId.toString(), "Target return of " + thresholds.targetReturn + "% achieved for " + strategy + " strategy.");
        }

        BigDecimal lossThreshold = switch (strategy) {
            case conservative -> new BigDecimal("-10");
            case moderate -> new BigDecimal("-15");
            case aggressive -> new BigDecimal("-20");
        };
        if (overallReturn.compareTo(lossThreshold) <= 0) {
            stopStrategy(userId);
            notificationService.notifyUser(userId.toString(), "Overall loss threshold exceeded for " + strategy + " strategy. Trading stopped.");
        }

        Instant earliestStart = investments.stream()
                .map(Investment::getCreatedAt)
                .min(Instant::compareTo)
                .orElse(Instant.now());
        if ((Instant.now().getEpochSecond() - earliestStart.getEpochSecond()) >= ONE_MONTH_SECONDS) {
            notificationService.notifyUser(userId.toString(), "1-month duration reached for " + strategy + " strategy. Please decide next steps.");
        }
    }

    @Transactional
    public void pauseStrategy(UUID userId) {
        updateStatus(userId, InvestmentStatus.paused);
    }

    @Transactional
    public void stopStrategy(UUID userId) {
        updateStatus(userId, InvestmentStatus.stopped);
    }

    @Transactional
    public void resumeStrategy(UUID userId) {
        updateStatus(userId, InvestmentStatus.active);
    }

    private void updateStatus(UUID userId, InvestmentStatus status) {
        List<Investment> investments = investmentRepository.findByUserIdAndType(userId, InvestmentType.auto);
        investments.forEach(inv -> inv.setStatus(status));
        investmentRepository.saveAll(investments);
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
                             BigDecimal targetReturn) {}
}