package com.money.mate.splitting_service.controller;

import com.money.mate.splitting_service.entity.SplittingMember;
import com.money.mate.splitting_service.service.SplittingMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/splitting-members")
public class SplittingMemberController {

    @Autowired
    private SplittingMemberService splittingMemberService;

    // Add a member to a saving plan
    @PostMapping
    public ResponseEntity<SplittingMember> addMember(
            @RequestParam UUID groupId,
            @RequestParam UUID userId,
            @RequestParam String role) {
        SplittingMember splittingMember = splittingMemberService.addMember(groupId, userId, role);
        return ResponseEntity.ok(splittingMember);
    }

    // Delete a member from a saving plan
    @DeleteMapping
    public ResponseEntity<String> deleteMember(
            @RequestParam UUID groupId,
            @RequestParam UUID userId) {
        splittingMemberService.deleteMember(groupId, userId);
        return ResponseEntity.ok("Member deleted successfully");
    }
}