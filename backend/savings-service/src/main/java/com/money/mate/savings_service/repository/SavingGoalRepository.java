package com.money.mate.savings_service.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.money.mate.savings_service.entity.SavingGoal;

@Repository
public interface SavingGoalRepository extends JpaRepository<SavingGoal,UUID> {

}
