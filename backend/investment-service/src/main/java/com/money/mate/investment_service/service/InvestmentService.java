package com.money.mate.investment_service.service;

import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.repository.InvestmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvestmentService {
    private final InvestmentRepository investmentRepository;

    public Investment saveInvestment(Investment investment) {
        return investmentRepository.save(investment);
    }

    public List<Investment> getUserInvestments(UUID userId) {
        return investmentRepository.findByUserId(userId);
    }

    public Optional<Investment> getInvestmentById(UUID investmentId) {
        return investmentRepository.findById(investmentId);
    }

    public void deleteInvestment(UUID investmentId) {
        investmentRepository.deleteById(investmentId);
    }
    // Manually buy stock and save the investment
    public Investment buyStock(UUID userId, String symbol, BigDecimal price, BigDecimal quantity) {
        Investment investment = investmentRepository.findByUserIdAndSymbol(userId, symbol)
                .orElse(new Investment(UUID.randomUUID(), userId, BigDecimal.ZERO, symbol, BigDecimal.ZERO, price, price, price, null));

        // Update quantity and total allocated amount
        investment.setQuantity(investment.getQuantity().add(quantity));
        investment.setAllocatedAmount(investment.getAllocatedAmount().add(price.multiply(quantity)));

        // Update the purchase price to reflect the latest price (could be an average or the most recent price)
        investment.setPurchasePrice(price);
        investment.setCurrentPrice(price);

        // Save the investment (buy stock)
        return investmentRepository.save(investment);
    }
    // Manually sell stock and update the investment
    public Investment sellStock(UUID userId, String symbol, BigDecimal price, BigDecimal quantity) {
        // Fetch the existing investment
        Investment investment = investmentRepository.findByUserIdAndSymbol(userId, symbol)
                .orElseThrow(() -> new IllegalArgumentException("Investment not found"));

        // Ensure the user has enough shares to sell
        if (investment.getQuantity().compareTo(quantity) < 0) {
            throw new IllegalArgumentException("Not enough shares to sell");
        }

        // Update the quantity after selling
        investment.setQuantity(investment.getQuantity().subtract(quantity));
        investment.setAllocatedAmount(investment.getAllocatedAmount().subtract(price.multiply(quantity)));

        // If all shares are sold, mark as closed
        if (investment.getQuantity().compareTo(BigDecimal.ZERO) == 0) {
            investment.setStatus("closed");
            investment.setClosedPrice(price);
        }

        // Save the updated investment
        return investmentRepository.save(investment);
    }
}

