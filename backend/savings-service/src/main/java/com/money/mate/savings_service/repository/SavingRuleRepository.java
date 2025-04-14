package com.money.mate.savings_service.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.money.mate.savings_service.entity.SavingRule;

@Repository
public interface SavingRuleRepository extends JpaRepository<SavingRule,UUID> {

}
