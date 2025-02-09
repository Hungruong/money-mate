package com.money.mate.user_service.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String name;
    private String phoneNumber;
    private String avatarUrl;
    private double income;
    private double manualTradingBalance;
    private double autoTradingBalance;
}