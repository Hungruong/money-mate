package com.money.mate.savings_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Date;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="saving_rules")
public class SavingRule {
    @Id
    @GeneratedValue(stratergy=GenerationType.UUID)
    private UUID roleId;

    @Column(nullable=false)
    private UUID planId;

    @Column(nullable=false)
    private UUID descriptionp;
    
}
