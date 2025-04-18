package com.money.mate.savings_service.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.money.mate.savings_service.entity.SavingGoal;
import com.money.mate.savings_service.repository.SavingGoalRepository;

@Service
public class SavingGoalService {

    @Autowired
    private SavingGoalRepository savingGoalRepository;

    // Create a new Saving Goal
    public SavingGoal createSavingGoal(SavingGoal savingGoal) {
        return savingGoalRepository.save(savingGoal);
    }

    // Get all Saving Goals
    public List<SavingGoal> getAllSavingGoals() {
        return savingGoalRepository.findAll();
    }

    // Get a Saving Goal by ID
    public Optional<SavingGoal> getSavingGoalById(UUID goalId) {
        return savingGoalRepository.findById(goalId);
    }

    // Update a Saving Goal
    public SavingGoal updateSavingGoal(UUID goalId, SavingGoal updatedSavingGoal) {
        return savingGoalRepository.findById(goalId)
                .map(existingGoal -> {
                    existingGoal.setTitle(updatedSavingGoal.getTitle());
                    existingGoal.setAmount(updatedSavingGoal.getAmount());
                    existingGoal.setDeadline(updatedSavingGoal.getDeadline());
                    existingGoal.setRuleDescription(updatedSavingGoal.getRuleDescription());
                    return savingGoalRepository.save(existingGoal);
                })
                .orElseThrow(() -> new RuntimeException("Saving Goal not found with id: " + goalId));
    }

    // Delete a Saving Goal
    public void deleteSavingGoal(UUID goalId) {
        savingGoalRepository.deleteById(goalId);
    }
}