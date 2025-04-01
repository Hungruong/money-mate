package com.money.mate.savings_service.service;

import com.money.mate.savings_service.entity.SavingPlan;
import com.money.mate.savings_service.repository.SavingGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SavingGroupService {

    @Autowired
    private SavingGroupRepository savingGroupRepository;

    public SavingPlan createGroup(SavingPlan savingGroup) {
        return savingGroupRepository.save(savingGroup);
    }

    public List<SavingPlan> getAllGroups() {
        return savingGroupRepository.findAll();
    }

    public SavingPlan getGroupById(UUID groupId) {
        return savingGroupRepository.findById(groupId).orElse(null);
    }

    public void deleteGroup(UUID groupId) {
        savingGroupRepository.deleteById(groupId);
    }
}