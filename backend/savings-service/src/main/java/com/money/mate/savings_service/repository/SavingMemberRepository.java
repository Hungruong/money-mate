package com.money.mate.savings_service.repository;

import com.money.mate.savings_service.entity.SavingMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SavingMemberRepository extends JpaRepository<SavingMember, UUID> {
    List<SavingMember> findByPlanId(UUID planId);
}
