package com.money.mate.payment_service.dto;

public class PaymentIntentResponse {
    private String clientSecret;
    private String status;
    private Long amount;
    private String currency;
    private String description;
    private String paymentMethod;
    private String[] paymentMethodTypes;
    private String id;

    // Existing constructor
    public PaymentIntentResponse(String clientSecret, String status, Long amount, String currency, String description, String paymentMethod, String[] paymentMethodTypes, String id) {
        this.clientSecret = clientSecret;
        this.status = status;
        this.amount = amount;
        this.currency = currency;
        this.description = description;
        this.paymentMethod = paymentMethod;
        this.paymentMethodTypes = paymentMethodTypes;
        this.id = id;
    }

    // New constructor for minimal response
    public PaymentIntentResponse(String clientSecret, String status) {
        this.clientSecret = clientSecret;
        this.status = status;
        this.amount = null;
        this.currency = null;
        this.description = null;
        this.paymentMethod = null;
        this.paymentMethodTypes = null;
        this.id = null;
    }

    // Getters
    public String getClientSecret() {
        return clientSecret;
    }

    public String getStatus() {
        return status;
    }

    public Long getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    public String getDescription() {
        return description;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String[] getPaymentMethodTypes() {
        return paymentMethodTypes;
    }

    public String getId() {
        return id;
    }
}