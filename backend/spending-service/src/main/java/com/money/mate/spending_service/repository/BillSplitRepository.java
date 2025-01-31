package com.money.mate.spending_service.repository;

import com.money.mate.spending_service.entity.BillSplit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BillSplitRepository extends JpaRepository<BillSplit, UUID> {
    List<BillSplit> findByUserId(UUID userId);
}
