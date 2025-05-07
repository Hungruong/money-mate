package com.money.mate.splitting_service.controller;

import com.money.mate.splitting_service.entity.SplittingGroup;
import com.money.mate.splitting_service.service.SplittingGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/saving-groups")
public class SplittingGroupController {

    @Autowired
    private SplittingGroupService splittingGroupService;

    @PostMapping
    public SplittingGroup createGroup(@RequestBody SplittingGroup savingGroup) {
        return splittingGroupService.createGroup(savingGroup);
    }

    @GetMapping
    public List<SplittingGroup> getAllGroups() {
        return splittingGroupService.getAllGroups();
    }

    @GetMapping("/{groupId}")
    public SplittingGroup getGroupById(@PathVariable UUID groupId) {
        return splittingGroupService.getGroupById(groupId);
    }

    @DeleteMapping("/{groupId}")
    public void deleteGroup(@PathVariable UUID groupId) {
        splittingGroupService.deleteGroup(groupId);
    }
}