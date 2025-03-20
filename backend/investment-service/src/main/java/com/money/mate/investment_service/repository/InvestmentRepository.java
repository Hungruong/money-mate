package com.money.mate.investment_service.repository;

import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.entity.Investment.InvestmentStatus;
import com.money.mate.investment_service.entity.Investment.InvestmentStrategy;
import com.money.mate.investment_service.entity.Investment.InvestmentType;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InvestmentRepository extends JpaRepository<Investment, UUID> {
    // Find investments by UserID and render in portfolio page
    List<Investment> findByUserId(UUID userId);

    // Find an investment by userID, symbol and status (only one should be found
    // here) -> update or create buy or sell
    Optional<Investment> findByUserIdAndSymbolAndStatus(UUID userId, String symbol, InvestmentStatus status);

    List<Investment> findByStrategyAndStatusAndType(InvestmentStrategy strategy, InvestmentStatus active,
            InvestmentType auto);

    List<Investment> findByUserIdAndType(UUID userId, InvestmentType auto);
}