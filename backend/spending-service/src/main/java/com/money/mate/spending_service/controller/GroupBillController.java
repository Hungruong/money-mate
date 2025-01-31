package com.money.mate.spending_service.controller;

import com.money.mate.spending_service.entity.GroupBill;
import com.money.mate.spending_service.service.GroupBillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/group-bills")
@RequiredArgsConstructor
public class GroupBillController {
    private final GroupBillService groupBillService;

    @PostMapping
    public ResponseEntity<GroupBill> createBill(@RequestBody GroupBill groupBill) {
        return ResponseEntity.ok(groupBillService.saveGroupBill(groupBill));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<GroupBill>> getUserBills(@PathVariable UUID userId) {
        return ResponseEntity.ok(groupBillService.getUserBills(userId));
    }

    @GetMapping("/bill/{billId}")
    public ResponseEntity<GroupBill> getBillById(@PathVariable UUID billId) {
        Optional<GroupBill> bill = groupBillService.getBillById(billId);
        return bill.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{billId}")
    public ResponseEntity<Void> deleteBill(@PathVariable UUID billId) {
        groupBillService.deleteBill(billId);
        return ResponseEntity.noContent().build();
    }
}
