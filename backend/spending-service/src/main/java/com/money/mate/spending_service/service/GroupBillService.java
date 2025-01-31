package com.money.mate.spending_service.service;

import com.money.mate.spending_service.entity.GroupBill;
import com.money.mate.spending_service.repository.GroupBillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GroupBillService {
    private final GroupBillRepository groupBillRepository;

    public GroupBill saveGroupBill(GroupBill groupBill) {
        return groupBillRepository.save(groupBill);
    }

    public List<GroupBill> getUserBills(UUID userId) {
        return groupBillRepository.findByCreatedBy(userId);
    }

    public Optional<GroupBill> getBillById(UUID billId) {
        return groupBillRepository.findById(billId);
    }

    public void deleteBill(UUID billId) {
        groupBillRepository.deleteById(billId);
    }
}
