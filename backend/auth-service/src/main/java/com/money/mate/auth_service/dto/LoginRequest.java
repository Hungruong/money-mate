package com.money.mate.auth_service.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data
@Getter
@Setter
public class LoginRequest {
    private String email;
    private String password;
}
