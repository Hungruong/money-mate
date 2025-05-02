package com.money.mate.savings_service.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.money.mate.savings_service.entity.SavingMember;
import com.money.mate.savings_service.service.SavingMemberService;

@RestController
@RequestMapping("/api/saving-members")
public class SavingMemberController {

    @Autowired
    private SavingMemberService savingMemberService;

    // Add a member to a saving plan
    @PostMapping
    public SavingMember addMember(
            @RequestParam UUID planId,
            @RequestParam UUID userId,
            @RequestParam String role) {
        return savingMemberService.addMember(planId, userId, role);
    }

    // Delete a member from a saving plan
    @DeleteMapping
    public ResponseEntity<String> deleteMember(
            @RequestParam UUID planId,  // Ensure this is marked as @RequestParam
            @RequestParam UUID userId) { // Ensure this is marked as @RequestParam
        savingMemberService.deleteMember(planId, userId);
        return ResponseEntity.ok("Member deleted successfully");
    }

    @GetMapping("/user/{userId}")
    public Optional<SavingMember> getMemberByUserId(@PathVariable UUID userId) {
        return savingMemberService.findMemberByUserId(userId);
    }
    @GetMapping
    public List<SavingMember> getMembers(@RequestParam UUID planId) {
        return savingMemberService.getMembersByPlanId(planId);
    }
    
}