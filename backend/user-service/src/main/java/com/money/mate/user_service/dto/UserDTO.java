package com.money.mate.user_service.dto;

import lombok.Data;

@Data
public class UserDTO {
    private String userName;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String avatarUrl;
    private double income;
    private double manualTradingBalance;
    private double autoTradingBalance;
}