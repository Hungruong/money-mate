package com.money.mate.investment_service.controller;

import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.service.InvestmentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/investments")
@RequiredArgsConstructor
public class InvestmentController {

    private static final Logger logger = LoggerFactory.getLogger(InvestmentController.class); // Logger instance
    private final InvestmentService investmentService;

    @PostMapping
    public ResponseEntity<Investment> createInvestment(@RequestBody Investment investment) {
        logger.debug("Received request to create investment: {}", investment); // Log the incoming request
        try {
            Investment savedInvestment = investmentService.saveInvestment(investment);
            logger.info("Investment created successfully: {}", savedInvestment); // Log the created investment
            return ResponseEntity.ok(savedInvestment);
        } catch (Exception e) {
            logger.error("Error creating investment: ", e); // Log any error during the process
            return ResponseEntity.status(500).build(); // Return an internal server error response
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Investment>> getUserInvestments(@PathVariable UUID userId) {
        logger.debug("Fetching investments for user: {}", userId); // Log the userId
        try {
            List<Investment> investments = investmentService.getUserInvestments(userId);
            logger.info("Fetched {} investments for user: {}", investments.size(), userId); // Log the results
            return ResponseEntity.ok(investments);
        } catch (Exception e) {
            logger.error("Error fetching investments for user {}: ", userId, e); // Log any error
            return ResponseEntity.status(500).build(); // Return an internal server error response
        }
    }

    @GetMapping("/investment/{investmentId}")
    public ResponseEntity<Investment> getInvestmentById(@PathVariable UUID investmentId) {
        logger.debug("Fetching investment by ID: {}", investmentId); // Log the investmentId
        try {
            Optional<Investment> investment = investmentService.getInvestmentById(investmentId);
            if (investment.isPresent()) {
                logger.info("Found investment: {}", investment.get()); // Log the found investment
                return ResponseEntity.ok(investment.get());
            } else {
                logger.warn("Investment not found for ID: {}", investmentId); // Log when investment is not found
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching investment by ID {}: ", investmentId, e); // Log any error
            return ResponseEntity.status(500).build(); // Return an internal server error response
        }
    }

    @DeleteMapping("/{investmentId}")
    public ResponseEntity<Void> deleteInvestment(@PathVariable UUID investmentId) {
        logger.debug("Received request to delete investment with ID: {}", investmentId); // Log the investmentId
        try {
            investmentService.deleteInvestment(investmentId);
            logger.info("Successfully deleted investment with ID: {}", investmentId); // Log successful deletion
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting investment with ID {}: ", investmentId, e); // Log any error
            return ResponseEntity.status(500).build(); // Return an internal server error response
        }
    }
}
