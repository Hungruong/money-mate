package com.money.mate.notification_service.service;

import com.money.mate.notification_service.entity.Notification;
import com.money.mate.notification_service.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public void sendNotification(UUID userId, String type, String content) {
        Notification notification = Notification.builder()
                .notificationId(UUID.randomUUID())
                .userId(userId)
                .type(type)
                .content(content)
                .status("Unread")
                .createdAt(Instant.now())
                .build();
        notificationRepository.save(notification);
    }

    public Optional<Notification> getNotification(UUID notificationId) {
        return notificationRepository.findById(notificationId);
    }

    public List<Notification> getUserNotifications(UUID userId) {
        return notificationRepository.findByUserId(userId);
    }

    public void markNotificationAsRead(UUID notificationId) {
        notificationRepository.markAsRead(notificationId);
    }
}
