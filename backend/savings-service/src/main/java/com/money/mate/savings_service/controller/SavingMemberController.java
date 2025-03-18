package com.money.mate.savings_service.controller;

import com.money.mate.savings_service.entity.SavingMember;
import com.money.mate.savings_service.service.SavingMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

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
}