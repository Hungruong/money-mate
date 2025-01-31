package com.money.mate.notification_service.entity;

import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    private UUID notificationId;
    private UUID userId;
    private String type;      // E.g., 'Payment', 'Reminder'
    private String content;
    private String status;    // 'Unread' or 'Read'
    private Instant createdAt;
    private Instant readAt;
}
