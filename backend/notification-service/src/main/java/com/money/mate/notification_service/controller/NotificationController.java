package com.money.mate.notification_service.controller;

import com.money.mate.notification_service.entity.Notification;
import com.money.mate.notification_service.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/send")
    public ResponseEntity<String> sendNotification(@RequestParam UUID userId,
                                                   @RequestParam String type,
                                                   @RequestParam String content) {
        notificationService.sendNotification(userId, type, content);
        return ResponseEntity.ok("Notification sent successfully.");
    }

    @GetMapping("/{notificationId}")
    public ResponseEntity<Optional<Notification>> getNotification(@PathVariable UUID notificationId) {
        return ResponseEntity.ok(notificationService.getNotification(notificationId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable UUID userId) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<String> markAsRead(@PathVariable UUID notificationId) {
        notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok("Notification marked as read.");
    }
}
