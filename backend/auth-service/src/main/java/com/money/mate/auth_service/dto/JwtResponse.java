package com.money.mate.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.UUID;
import lombok.NoArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;
@Data
@AllArgsConstructor
public class JwtResponse {
    private String token;
    private String userName;
    private String email;
    private UUID userId;
}
