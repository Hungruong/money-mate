package com.money.mate.splitting_service.service;

import com.money.mate.splitting_service.entity.SplittingGroup;
import com.money.mate.splitting_service.repository.SplittingGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class SplittingGroupService {

    @Autowired
    private SplittingGroupRepository splittingGroupRepository;

    public SplittingGroup createGroup(SplittingGroup splittingGroup) {
        return splittingGroupRepository.save(splittingGroup);
    }

    public List<SplittingGroup> getAllGroups() {
        return splittingGroupRepository.findAll();
    }

    public SplittingGroup getGroupById(UUID groupId) {
        return splittingGroupRepository.findById(groupId).orElse(null);
    }

    public void deleteGroup(UUID groupId) {
        splittingGroupRepository.deleteById(groupId);
    }
}