package com.money.mate.payment_service.service;

import com.money.mate.payment_service.dto.PaymentIntentResponse;
import com.money.mate.payment_service.dto.PaymentRequest;
import com.money.mate.payment_service.entity.Payment;
import com.money.mate.payment_service.repository.PaymentRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public PaymentIntentResponse createPaymentIntent(PaymentRequest request) throws StripeException {
        // Create Stripe payment intent
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(request.getAmount().multiply(BigDecimal.valueOf(100)).longValue())
                .setCurrency(request.getCurrency())
                .setPaymentMethod("pm_card_visa")
                .addPaymentMethodType("card")
                .setDescription(request.getDescription())
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        // Save payment record in DB
        Payment payment = Payment.builder()
                .paymentIntentId(paymentIntent.getId())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .description(request.getDescription())
                .userId(UUID.fromString(request.getUserId()))
                .type(request.getType())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        paymentRepository.save(payment);

        // Build and return response
        return new PaymentIntentResponse(paymentIntent.getClientSecret(), paymentIntent.getStatus());
    }

    public PaymentIntentResponse getPaymentIntent(String paymentIntentId) throws StripeException {
        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
        return new PaymentIntentResponse(intent.getClientSecret(), intent.getStatus());
    }
}

