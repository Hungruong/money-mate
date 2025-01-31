package com.money.mate.spending_service.entity;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ScannedBill {
    private UUID billId;
    private UUID userId;
    private String receiptUrl;
    private String extractedText;
}