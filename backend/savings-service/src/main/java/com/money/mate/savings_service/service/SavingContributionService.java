package com.money.mate.savings_service.service;

import com.money.mate.savings_service.entity.SavingContribution;
import com.money.mate.savings_service.repository.SavingContributionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class SavingContributionService {

    @Autowired
    private SavingContributionRepository repository;

    public SavingContribution createContribution(SavingContribution contribution) {
        return repository.save(contribution);
    }

    public Optional<SavingContribution> getContribution(UUID id) {
        return repository.findById(id);
    }

    public void deleteContribution(UUID id) {
        repository.deleteById(id);
    }
}