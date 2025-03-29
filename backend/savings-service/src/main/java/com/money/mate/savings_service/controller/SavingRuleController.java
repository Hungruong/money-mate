package com.money.mate.savings_service.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.money.mate.savings_service.entity.SavingRule;
import com.money.mate.savings_service.service.SavingRuleService;

@RestController
//@CrossOrigin(origins = "http://localhost:8081") 
@RequestMapping("/api/saving-rules")
public class SavingRuleController {

    @Autowired
    private SavingRuleService savingRuleService;

    // Create a new Saving Rule
    @PostMapping
    public ResponseEntity<SavingRule> createSavingRule(@RequestBody SavingRule savingRule) {
        SavingRule createdRule = savingRuleService.createSavingRule(savingRule);
        return ResponseEntity.ok(createdRule);
    }

    // Get all Saving Rules
    @GetMapping
    public ResponseEntity<List<SavingRule>> getAllSavingRules() {
        List<SavingRule> rules = savingRuleService.getAllSavingRules();
        return ResponseEntity.ok(rules);
    }

    // Get a Saving Rule by ID
    @GetMapping("/{ruleId}")
    public ResponseEntity<SavingRule> getSavingRuleById(@PathVariable UUID ruleId) {
        return savingRuleService.getSavingRuleById(ruleId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update a Saving Rule
    @PutMapping("/{ruleId}")
    public ResponseEntity<SavingRule> updateSavingRule(@PathVariable UUID ruleId, @RequestBody SavingRule updatedSavingRule) {
        SavingRule updatedRule = savingRuleService.updateSavingRule(ruleId, updatedSavingRule);
        return ResponseEntity.ok(updatedRule);
    }

    // Delete a Saving Rule
    @DeleteMapping("/{ruleId}")
    public ResponseEntity<Void> deleteSavingRule(@PathVariable UUID ruleId) {
        savingRuleService.deleteSavingRule(ruleId);
        return ResponseEntity.noContent().build();
    }
}
// 