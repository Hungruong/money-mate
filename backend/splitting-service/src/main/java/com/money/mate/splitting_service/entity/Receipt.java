package com.money.mate.splitting_service.entity;

import java.util.UUID;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "receipts")
public class Receipt {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID receiptId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private SplittingGroup group;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false, updatable = false)
    private Date createdAt = new Date();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "receipt_id", nullable = false)
    private List<ReceiptItem> items = new ArrayList<>();

    public Receipt(List<ReceiptItem> items) {
        this.items = items;
    }
}
