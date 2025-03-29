package com.money.mate.savings_service.service;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.money.mate.savings_service.entity.SavingRule;
import com.money.mate.savings_service.repository.SavingRuleRepository;
@Service

public class SavingRuleService {
    

    @Autowired
    private SavingRuleRepository savingRuleRepository;

    // Create a new Saving Goal
    public SavingRule createSavingRule(SavingRule savingRule) {
        return savingRuleRepository.save(savingRule);
    }

    // Get all Saving Goals
    public List<SavingRule> getAllSavingRules() {
        return savingRuleRepository.findAll();
    }

    // Get a Saving Goal by ID
    public Optional<SavingRule> getSavingRuleById(UUID ruleId) {
        return savingRuleRepository.findById(ruleId);
    }

    // Update a Saving Goal
    public SavingRule updateSavingRule(UUID ruleId, SavingRule updatedSavingRule) {
        return savingRuleRepository.findById(ruleId)
                .map(existingRule -> {
                    existingRule.setDescription(updatedSavingRule.getDescription());
                    return savingRuleRepository.save(existingRule);
                })
                .orElseThrow(() -> new RuntimeException("Saving Rule not found with id: " + ruleId));
    }

    // Delete a Saving Goal
    public void deleteSavingRule(UUID ruleId) {
        savingRuleRepository.deleteById(ruleId);
    }
}