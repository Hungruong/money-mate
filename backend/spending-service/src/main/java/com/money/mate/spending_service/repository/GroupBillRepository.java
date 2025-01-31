package com.money.mate.spending_service.repository;

import com.money.mate.spending_service.entity.GroupBill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GroupBillRepository extends JpaRepository<GroupBill, UUID> {
    List<GroupBill> findByCreatedBy(UUID createdBy);
}
