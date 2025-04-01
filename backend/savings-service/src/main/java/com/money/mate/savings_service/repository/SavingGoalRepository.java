package com.money.mate.savings_service.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.money.mate.savings_service.entity.SavingGoal;

@Repository
public interface SavingGoalRepository extends JpaRepository<SavingGoal,UUID> {
    //Create rules
    //Read rules
    //Update rules
    //Delete rules
    

}
