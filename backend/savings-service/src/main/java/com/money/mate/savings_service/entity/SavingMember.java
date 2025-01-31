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
@Table(name = "saving_members")
public class SavingMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID memberId;

    @Column(nullable = false)
    private UUID planId;

    @Column(nullable = false)
    private UUID userId;

    @Column(nullable = false, length = 20)
    private String role; // Admin or Member

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date joinedAt = new Date();
}
