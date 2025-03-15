package com.money.mate.savings_service.controller;

import com.money.mate.savings_service.entity.SavingPlan;
import com.money.mate.savings_service.service.SavingPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class SavingPlanController {

    @Autowired
    private SavingPlanService savingPlanService;

    @PostMapping("/saving-plans")
    public ResponseEntity<SavingPlan> createGroupSavingPlan(@Valid @RequestBody SavingPlan savingPlan) {
        if (!"Group".equalsIgnoreCase(savingPlan.getPlanType())) {
            return ResponseEntity.badRequest().build();
        }
        SavingPlan createdPlan = savingPlanService.createGroupSavingPlan(savingPlan);
        return ResponseEntity.ok(createdPlan);
    }
}