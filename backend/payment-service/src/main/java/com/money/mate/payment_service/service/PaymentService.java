package com.money.mate.payment_service.service;

import com.money.mate.payment_service.entity.Payment;
import com.money.mate.payment_service.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    public Optional<Payment> getPaymentById(UUID paymentId) {
        return paymentRepository.findById(paymentId);
    }

    public Optional<Payment> getPaymentByIntentId(String paymentIntentId) {
        return paymentRepository.findByPaymentIntentId(paymentIntentId);
    }

    public List<Payment> getPaymentsByUserId(UUID userId) {
        return paymentRepository.findAll().stream()
                .filter(payment -> payment.getUserId().equals(userId))
                .toList();
    }
}
