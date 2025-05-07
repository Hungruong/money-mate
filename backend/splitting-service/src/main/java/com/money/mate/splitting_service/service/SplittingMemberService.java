package com.money.mate.splitting_service.service;

import com.money.mate.splitting_service.entity.SplittingMember;
import com.money.mate.splitting_service.repository.SplittingMemberRepository;
import com.money.mate.splitting_service.repository.SplittingGroupRepository;
import com.money.mate.splitting_service.entity.SplittingGroup;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;
import jakarta.persistence.EntityNotFoundException;

@Service
public class SplittingMemberService {

    @Autowired
    private SplittingGroupRepository splittingGroupRepository;

    @Autowired
    private SplittingMemberRepository splittingMemberRepository;

    // Add a member to a splitting group
    public SplittingMember addMember(UUID groupId, UUID userId, String role) {
        SplittingGroup group = splittingGroupRepository.findById(groupId)
                .orElseThrow(() -> new EntityNotFoundException("Group not found"));

        SplittingMember member = new SplittingMember();
        member.setGroup(group);
        member.setUserId(userId);
        member.setRole(role);
        return splittingMemberRepository.save(member);
    }

    // Delete a member from a splitting group
    @Transactional
    public void deleteMember(UUID groupId, UUID userId) {
        splittingMemberRepository.deleteByUserIdAndGroup_GroupId(userId, groupId);
    }

}