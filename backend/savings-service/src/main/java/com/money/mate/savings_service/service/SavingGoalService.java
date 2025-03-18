package com.money.mate.savings_service.service;

import org.springframework.beans.factory.annotation.Autowired;

import com.money.mate.savings_service.repository.SavingGoalRepository;

public class SavingGoalService {
    @Autowired
    private SavingGoalRepository savingGoalRepository;

    //Create new saving role
    public List<SavingGoal> getSavingGoalsByPlanId(UUID planId){
        return savingGoalRepository.save(savingGoal);
    }
    
    
}
