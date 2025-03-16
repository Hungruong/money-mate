package com.money.mate.savings_service.controller;

import com.money.mate.savings_service.entity.SavingPlan;
import com.money.mate.savings_service.service.SavingGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/saving-groups")
public class SavingGroupController {

    @Autowired
    private SavingGroupService savingGroupService;

    @PostMapping
    public SavingPlan createGroup(@RequestBody SavingPlan savingGroup) {
        return savingGroupService.createGroup(savingGroup);
    }

    @GetMapping
    public List<SavingPlan> getAllGroups() {
        return savingGroupService.getAllGroups();
    }

    @GetMapping("/{groupId}")
    public SavingPlan getGroupById(@PathVariable UUID groupId) {
        return savingGroupService.getGroupById(groupId);
    }

    @DeleteMapping("/{groupId}")
    public void deleteGroup(@PathVariable UUID groupId) {
        savingGroupService.deleteGroup(groupId);
    }
}