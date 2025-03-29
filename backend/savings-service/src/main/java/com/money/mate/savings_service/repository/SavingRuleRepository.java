package com.money.mate.savings_service.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.money.mate.savings_service.entity.SavingRule;

@Repository
public interface SavingRuleRepository extends JpaRepository<SavingRule,UUID> {
    //Create rules
    //Read rules
    //Update rules
    //Delete rules
    

}
