package com.money.mate.splitting_service.repository;

import com.money.mate.splitting_service.entity.SplittingGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SplittingGroupRepository extends JpaRepository<SplittingGroup, UUID> {
}