package com.money.mate.payment_service.dto;

public class PaymentIntentResponse {
    private String clientSecret;
    private String status;

    public PaymentIntentResponse(String clientSecret, String status) {
        this.clientSecret = clientSecret;
        this.status = status;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public String getStatus() {
        return status;
    }
}
