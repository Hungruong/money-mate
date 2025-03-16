package com.money.mate.savings_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "saving_group")
public class SavingGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID groupId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String members;

    public SavingGroup(String name, String members) {
        this.name = name;
        this.members = members;
    }
}