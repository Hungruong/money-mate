package com.money.mate.savings_service.service;

import java.math.BigDecimal;
import com.money.mate.savings_service.entity.SavingContribution;
import com.money.mate.savings_service.repository.SavingContributionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.money.mate.savings_service.entity.SavingPlan;
import com.money.mate.savings_service.repository.SavingPlanRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SavingContributionService {

    @Autowired
    private SavingContributionRepository repository;
    @Autowired
    private SavingPlanRepository savingPlanRepository;

    //public SavingContribution createContribution(SavingContribution contribution) {
        //return repository.save(contribution);
    //}

    public Optional<SavingContribution> getContribution(UUID id) {
        return repository.findById(id);
    }

    public List<SavingContribution> listContributions() {
        return repository.findAll();
    }

    public List<SavingContribution> listByPlanId(UUID planId) {
        return repository.findByPlanId(planId);
    }

    public List<SavingContribution> listByPlanIdAndUserId(UUID planId, UUID userId) {
        return repository.findByPlanIdAndUserId(planId, userId);
    }


    @Transactional
    public SavingContribution makeContribution(UUID planId, UUID userId, BigDecimal amount, String note) {
        SavingPlan savingPlan = savingPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Saving Plan not found"));

        //logger.info("Making contribution of {} for plan ID {}", amount, planId);

        SavingContribution contribution = new SavingContribution();
        contribution.setPlanId(planId);
        contribution.setUserId(userId);
        contribution.setAmount(amount);
        contribution.setNote(note);

        // Save the contribution
        SavingContribution savedContribution = repository.save(contribution);
        //logger.info("Saved contribution: {}", savedContribution);
        // Update the currentAmount in SavingPlan
        savingPlan.setCurrentAmount(savingPlan.getCurrentAmount() + amount.doubleValue());
        savingPlanRepository.save(savingPlan);
        //logger.info("Updated saving plan ID {}: new current amount is {}", planId, newAmount);

        return savedContribution;
    }
}