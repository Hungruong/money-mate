package com.money.mate.savings_service.repository;

import com.money.mate.savings_service.entity.SavingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SavingPlanRepository extends JpaRepository<SavingPlan, UUID> {
    List<SavingPlan> findByUserId(UUID userId);
}
