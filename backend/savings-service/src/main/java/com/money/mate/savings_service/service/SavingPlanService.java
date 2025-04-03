package com.money.mate.savings_service.service;

import com.money.mate.savings_service.entity.SavingPlan;
import com.money.mate.savings_service.repository.SavingPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SavingPlanService {

    @Autowired
    private SavingPlanRepository savingPlanRepository;

    public SavingPlan createPlan(SavingPlan savingPlan) {
        return savingPlanRepository.save(savingPlan);
    }

    public List<SavingPlan> getAllPlans() {
        return savingPlanRepository.findAll();
    }

    public SavingPlan getPlanById(UUID planId) {
        return savingPlanRepository.findById(planId).orElse(null);
    }

    public void deletePlan(UUID planId) {
        savingPlanRepository.deleteById(planId);
    }

}