package com.money.mate.splitting_service.repository;

import com.money.mate.splitting_service.entity.SplittingMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.Optional;

@Repository
public interface SplittingMemberRepository extends JpaRepository<SplittingMember, UUID> {

    // Find a member by userId
    Optional<SplittingMember> findByUserId(UUID userId);

    // Find a member by userId and groupId
    Optional<SplittingMember> findByUserIdAndGroup_GroupId(UUID userId, UUID groupId);

    // Delete a member by userId and groupId
    @Modifying
    void deleteByUserIdAndGroup_GroupId(UUID userId, UUID groupId);

}