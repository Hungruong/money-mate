package com.money.mate.investment_service.service;

import com.money.mate.investment_service.entity.AutoTradeLog;
import com.money.mate.investment_service.repository.AutoTradeLogRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class AutoTradeService {

    private final AutoTradeLogRepository autoTradeLogRepository;

    public AutoTradeService(AutoTradeLogRepository autoTradeLogRepository) {
        this.autoTradeLogRepository = autoTradeLogRepository;
    }

    public void saveTradeLog(AutoTradeLog log) {
        autoTradeLogRepository.save(log);
    }

    public Optional<AutoTradeLog> getTradeLogById(UUID logId) {
        return autoTradeLogRepository.findById(logId);
    }
}
