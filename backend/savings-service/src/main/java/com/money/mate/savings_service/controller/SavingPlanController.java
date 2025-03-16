package com.money.mate.savings_service.controller;

import com.money.mate.savings_service.entity.SavingPlan;
import com.money.mate.savings_service.service.SavingPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/saving-plans")
public class SavingPlanController {

    @Autowired
    private SavingPlanService savingPlanService;

    @PostMapping
    public SavingPlan createPlan(@RequestBody SavingPlan savingPlan) {
        return savingPlanService.createPlan(savingPlan);
    }

    @GetMapping
    public List<SavingPlan> getAllPlans() {
        return savingPlanService.getAllPlans();
    }

    @GetMapping("/{planId}")
    public SavingPlan getPlanById(@PathVariable UUID planId) {
        return savingPlanService.getPlanById(planId);
    }

    @DeleteMapping("/{planId}")
    public void deletePlan(@PathVariable UUID planId) {
        savingPlanService.deletePlan(planId);
    }
}