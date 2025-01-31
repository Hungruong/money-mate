package com.money.mate.notification_service.repository;

import com.money.mate.notification_service.entity.Notification;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Repository
public class NotificationRepository {

    private final Map<UUID, Notification> notificationStore = new ConcurrentHashMap<>();

    public void save(Notification notification) {
        notificationStore.put(notification.getNotificationId(), notification);
    }

    public Optional<Notification> findById(UUID notificationId) {
        return Optional.ofNullable(notificationStore.get(notificationId));
    }

    public List<Notification> findByUserId(UUID userId) {
        List<Notification> userNotifications = new ArrayList<>();
        for (Notification notification : notificationStore.values()) {
            if (notification.getUserId().equals(userId)) {
                userNotifications.add(notification);
            }
        }
        return userNotifications;
    }

    public void markAsRead(UUID notificationId) {
        Notification notification = notificationStore.get(notificationId);
        if (notification != null) {
            notification.setStatus("Read");
            notification.setReadAt(Instant.now());
            notificationStore.put(notificationId, notification);
        }
    }
}
