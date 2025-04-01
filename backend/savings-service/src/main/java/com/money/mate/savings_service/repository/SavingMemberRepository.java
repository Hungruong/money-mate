package com.money.mate.savings_service.repository;

import com.money.mate.savings_service.entity.SavingMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.UUID;



@Repository
public interface SavingMemberRepository extends JpaRepository<SavingMember, UUID> {

    // Find a member by userId and planId
    SavingMember findByUserIdAndPlanId(UUID userId, UUID planId);

    // Delete a member by userId and planId
    @Modifying
    @Query("DELETE FROM SavingMember sm WHERE sm.userId = :userId AND sm.planId = :planId")
    void deleteByUserIdAndPlanId(@Param("userId") UUID userId, @Param("planId") UUID planId);
}