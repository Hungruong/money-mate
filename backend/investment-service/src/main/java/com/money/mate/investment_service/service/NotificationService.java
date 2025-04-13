package com.money.mate.investment_service.service;

import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    public void notifyUser(String userId, String message) {
        // Placeholder: implement email, SMS, or UI notification
        System.out.println("Notification to user " + userId + ": " + message);
    }
}