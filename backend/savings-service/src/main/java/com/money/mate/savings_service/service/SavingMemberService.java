package com.money.mate.savings_service.service;

import com.money.mate.savings_service.entity.SavingMember;
import com.money.mate.savings_service.repository.SavingMemberRepository;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class SavingMemberService {

    @Autowired
    private SavingMemberRepository savingMemberRepository;

    // Add a member to a saving plan
    public SavingMember addMember(UUID planId, UUID userId, String role) {
        SavingMember member = new SavingMember();
        member.setPlanId(planId);
        member.setUserId(userId);
        member.setRole(role);
        return savingMemberRepository.save(member);
    }

    // Delete a member from a saving plan
    @Transactional
    public void deleteMember(UUID planId, UUID userId) {
        savingMemberRepository.deleteByUserIdAndPlanId(userId, planId);
    }
    
}