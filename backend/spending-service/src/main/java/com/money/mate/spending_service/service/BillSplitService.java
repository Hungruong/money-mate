package com.money.mate.spending_service.service;

import com.money.mate.spending_service.entity.BillSplit;
import com.money.mate.spending_service.repository.BillSplitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BillSplitService {
    private final BillSplitRepository billSplitRepository;

    public List<BillSplit> getUserSplits(UUID userId) {
        return billSplitRepository.findByUserId(userId);
    }

    public BillSplit saveBillSplit(BillSplit billSplit) {
        return billSplitRepository.save(billSplit);
    }
}
