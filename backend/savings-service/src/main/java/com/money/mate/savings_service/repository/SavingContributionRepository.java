package com.money.mate.savings_service.repository;

import com.money.mate.savings_service.entity.SavingContribution;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SavingContributionRepository extends JpaRepository<SavingContribution, UUID> {
    List<SavingContribution> findByPlanId(UUID planId);
    List<SavingContribution> findByPlanIdAndUserId(UUID planId, UUID userId);
}