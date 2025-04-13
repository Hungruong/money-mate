package com.money.mate.user_service.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.UUID;

public class UserDTO {
    @JsonProperty("userId")
    private UUID userId;

    @JsonProperty("manualTradingBalance")
    private double manualTradingBalance;

    @JsonProperty("autoTradingBalance")
    private double autoTradingBalance;


    // Constructors
    public UserDTO() {}
    
    public UserDTO(UUID userId, double manualTradingBalance) {
        this.userId = userId;
        this.manualTradingBalance = manualTradingBalance;
        this.autoTradingBalance = autoTradingBalance;
    }

    // Getters and Setters
    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public double getManualTradingBalance() { return manualTradingBalance; }
    public void setManualTradingBalance(double manualTradingBalance) { this.manualTradingBalance = manualTradingBalance; }
    public double getAutoTradingBalance() { return autoTradingBalance; }
    public void setAutoTradingBalance(double autoTradingBalance) { this.autoTradingBalance = autoTradingBalance; }
}
