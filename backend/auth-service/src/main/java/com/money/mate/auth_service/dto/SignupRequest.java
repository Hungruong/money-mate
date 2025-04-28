package com.money.mate.auth_service.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
@Data

@Getter
@Setter
public class SignupRequest {
    private String email;
    private String password;
    private String userName;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String avatarUrl;
}
