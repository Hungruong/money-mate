package com.money.mate.spending_service.service;

import com.money.mate.spending_service.entity.ScannedBill;
import com.money.mate.spending_service.repository.ScannedBillRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ScannedBillService {

    private final ScannedBillRepository scannedBillRepository;

    public ScannedBillService(ScannedBillRepository scannedBillRepository) {
        this.scannedBillRepository = scannedBillRepository;
    }

    public ScannedBill saveScannedBill(ScannedBill scannedBill) {
        scannedBillRepository.save(scannedBill);
        return scannedBill;
    }

    public List<ScannedBill> getUserScannedBills(UUID userId) {
        return scannedBillRepository.findByUserId(userId);
    }

    public void deleteScannedBill(UUID billId) {
        // Implement delete logic here if needed
    }
}