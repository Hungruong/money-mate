package com.money.mate.spending_service.controller;

import com.money.mate.spending_service.entity.ScannedBill;
import com.money.mate.spending_service.service.ScannedBillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/scanned-bills")
public class ScannedBillController {

    private final ScannedBillService scannedBillService;

    public ScannedBillController(ScannedBillService scannedBillService) {
        this.scannedBillService = scannedBillService;
    }

    @PostMapping
    public ResponseEntity<ScannedBill> uploadScannedBill(@RequestBody ScannedBill scannedBill) {
        return ResponseEntity.ok(scannedBillService.saveScannedBill(scannedBill));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<ScannedBill>> getUserScannedBills(@PathVariable UUID userId) {
        return ResponseEntity.ok(scannedBillService.getUserScannedBills(userId));
    }

    @DeleteMapping("/{billId}")
    public ResponseEntity<String> deleteScannedBill(@PathVariable UUID billId) {
        scannedBillService.deleteScannedBill(billId);
        return ResponseEntity.ok("Scanned bill deleted successfully.");
    }
}
