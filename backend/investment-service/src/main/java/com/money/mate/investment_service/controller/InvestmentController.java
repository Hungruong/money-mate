package com.money.mate.investment_service.controller;

import com.money.mate.investment_service.service.InvestmentService;
import com.money.mate.investment_service.service.MarketDataService;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class InvestmentController {

    private static final Logger logger = LoggerFactory.getLogger(InvestmentController.class);
    private final InvestmentService investmentService;
    private final MarketDataService marketDataService; // Add this

    @GetMapping("/price/{symbol}")
    public ResponseEntity<BigDecimal> getPrice(@PathVariable String symbol) {
        logger.info("Fetching price for symbol: {}", symbol);
        try {
            BigDecimal price = marketDataService.getCurrentStockPrice(symbol); // Use injected service
            return ResponseEntity.ok(price);
        } catch (Exception e) {
            logger.error("Error fetching price for symbol: {}", symbol, e);
            return ResponseEntity.status(500).body(null);
        }
    }

    // Endpoint to buy an asset
    @PostMapping("/buy")
    public ResponseEntity<String> buyInvestment(@RequestBody InvestmentRequestDto request) {
        logger.info("Received request to buy investment: {}", request);
        try {
            investmentService.buyAsset(request.getUserId(), request.getSymbol(), request.getQuantity());
            logger.info("Investment bought successfully for user: {}", request.getUserId());
            return ResponseEntity.ok("Investment bought successfully.");
        } catch (IllegalArgumentException e) {
            logger.error("Error buying investment: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (OptimisticLockingFailureException e) {
            logger.error("Optimistic locking failure while saving investment: " + request);
            return ResponseEntity.status(500).body("Error buying investment. Please try again.");
        }
    }

    // Endpoint to sell an asset
    @PostMapping("/sell")
    public ResponseEntity<String> sellInvestment(@RequestBody InvestmentRequestDto request) {
        logger.info("Received request to sell investment: {}", request);
        try {
            investmentService.sellAsset(request.getUserId(), request.getSymbol(), request.getQuantity());
            logger.info("Investment sold successfully for user: {}", request.getUserId());
            return ResponseEntity.ok("Investment sold successfully.");
        } catch (IllegalArgumentException e) {
            logger.error("Error selling investment: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get user investments
    @GetMapping("/{userId}")
    public ResponseEntity<Object> getUserInvestments(@PathVariable UUID userId) {
        logger.info("Fetching investments for user: {}", userId);
        try {
            var investments = investmentService.getUserInvestments(userId);
            logger.info("Successfully fetched investments for user: {}", userId);
            return ResponseEntity.ok(investments);
        } catch (Exception e) {
            logger.error("Error fetching investments for user: {}", userId, e);
            return ResponseEntity.status(500).body("Error fetching investments.");
        }
    }
}
