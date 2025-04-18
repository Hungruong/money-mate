package com.money.mate.savings_service.service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.money.mate.savings_service.entity.SavingMember;
import com.money.mate.savings_service.repository.SavingMemberRepository;
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
    public Optional<SavingMember> findMemberByUserId(UUID userId) {
        return savingMemberRepository.findByUserId(userId);
    }
    
    // Alternatively, if you want to find all saving plans a user is part of:
    public List<SavingMember> findAllByUserId(UUID userId) {
        return savingMemberRepository.findAllByUserId(userId);
    }
    public List<SavingMember> getMembersByPlanId(UUID planId) {
        return savingMemberRepository.findByPlanId(planId);
    }
}