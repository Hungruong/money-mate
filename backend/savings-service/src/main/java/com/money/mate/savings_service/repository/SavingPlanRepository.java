package com.money.mate.savings_service.repository;

import com.money.mate.savings_service.entity.SavingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SavingPlanRepository extends JpaRepository<SavingPlan, UUID> {
    
}