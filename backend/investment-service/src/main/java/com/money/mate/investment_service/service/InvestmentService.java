package com.money.mate.investment_service.service;

import com.money.mate.investment_service.entity.Investment;
import com.money.mate.investment_service.repository.InvestmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
