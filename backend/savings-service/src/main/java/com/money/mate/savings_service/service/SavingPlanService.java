package com.money.mate.savings_service.service;

import com.money.mate.savings_service.entity.SavingPlan;
import com.money.mate.savings_service.repository.SavingPlanRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class SavingPlanService {

    private final SavingPlanRepository savingPlanRepository;

    @Autowired
    public SavingPlanService(SavingPlanRepository savingPlanRepository) {
        this.savingPlanRepository = savingPlanRepository;
    }

    // Existing methods
    public SavingPlan createPlan(SavingPlan savingPlan) {
        return savingPlanRepository.save(savingPlan);
    }

    public List<SavingPlan> getAllPlans() {
        return savingPlanRepository.findAll();
    }

    public SavingPlan getPlanById(UUID planId) {
        return savingPlanRepository.findById(planId)
                .orElseThrow(() -> new EntityNotFoundException("Savings plan not found"));
    }


    public void deletePlan(UUID planId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deletePlan'");
    }
}