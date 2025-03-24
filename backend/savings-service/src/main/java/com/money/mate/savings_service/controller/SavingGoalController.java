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

import com.money.mate.savings_service.entity.SavingGoal;
import com.money.mate.savings_service.service.SavingGoalService;

@RestController
@RequestMapping("/api/saving-goals")
public class SavingGoalController {

    @Autowired
    private SavingGoalService savingGoalService;

    // Create a new Saving Goal
    @PostMapping
    public ResponseEntity<SavingGoal> createSavingGoal(@RequestBody SavingGoal savingGoal) {
        SavingGoal createdGoal = savingGoalService.createSavingGoal(savingGoal);
        return ResponseEntity.ok(createdGoal);
    }

    // Get all Saving Goals
    @GetMapping
    public ResponseEntity<List<SavingGoal>> getAllSavingGoals() {
        List<SavingGoal> goals = savingGoalService.getAllSavingGoals();
        return ResponseEntity.ok(goals);
    }

    // Get a Saving Goal by ID
    @GetMapping("/{goalId}")
    public ResponseEntity<SavingGoal> getSavingGoalById(@PathVariable UUID goalId) {
        return savingGoalService.getSavingGoalById(goalId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update a Saving Goal
    @PutMapping("/{goalId}")
    public ResponseEntity<SavingGoal> updateSavingGoal(@PathVariable UUID goalId, @RequestBody SavingGoal updatedSavingGoal) {
        SavingGoal updatedGoal = savingGoalService.updateSavingGoal(goalId, updatedSavingGoal);
        return ResponseEntity.ok(updatedGoal);
    }

    // Delete a Saving Goal
    @DeleteMapping("/{goalId}")
    public ResponseEntity<Void> deleteSavingGoal(@PathVariable UUID goalId) {
        savingGoalService.deleteSavingGoal(goalId);
        return ResponseEntity.noContent().build();
    }
}
// 