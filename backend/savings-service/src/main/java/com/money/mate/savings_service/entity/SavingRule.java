package com.money.mate.savings_service.entity;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="saving_rules")
public class SavingRule {
    @Id
    @GeneratedValue(strategy=GenerationType.UUID)
    private UUID roleId;

    @Column(nullable=false)
    private UUID planId;

    @Column(nullable=false)
    private UUID description;
    
}
