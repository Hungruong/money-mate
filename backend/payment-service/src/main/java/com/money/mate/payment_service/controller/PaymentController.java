package com.money.mate.payment_service.controller;

import com.money.mate.payment_service.dto.PaymentIntentResponse;
import com.money.mate.payment_service.dto.PaymentRequest;
import com.money.mate.payment_service.service.PaymentService;
import com.stripe.exception.StripeException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/payment_intents")
    public PaymentIntentResponse createPaymentIntent(@RequestBody PaymentRequest paymentRequest) throws StripeException {
        return paymentService.createPaymentIntent(paymentRequest);
    }

    @GetMapping("/payment_intents/{id}")
    public PaymentIntentResponse getPaymentIntent(@PathVariable String id) throws StripeException {
        return paymentService.getPaymentIntent(id);
    }

    @GetMapping("/payment_intents")
    public PaymentIntentResponse getPaymentIntentById(@RequestParam String id) throws StripeException {
        return paymentService.getPaymentIntent(id);
    }
}