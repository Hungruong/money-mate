package com.money.mate.savings_service.service;

import com.money.mate.savings_service.entity.SavingPlan;
import com.money.mate.savings_service.repository.SavingPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.UUID;

@Service
public class SavingPlanService {

    @Autowired
    private SavingPlanRepository savingPlanRepository;

    public SavingPlan createGroupSavingPlan(SavingPlan savingPlan) {
        savingPlan.setPlanId(UUID.randomUUID());
        savingPlan.setCreatedAt(new Date());
        return savingPlanRepository.save(savingPlan);
    }
}