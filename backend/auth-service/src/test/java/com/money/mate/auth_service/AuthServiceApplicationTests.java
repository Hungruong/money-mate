package com.money.mate.auth_service;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
    "spring.jpa.hibernate.ddl-auto=none",
    "spring.datasource.url=jdbc:postgresql://localhost:5432/test_db",
    "spring.datasource.username=test",
    "spring.datasource.password=test"
})
class AuthServiceApplicationTests {
    @Test
    void contextLoads() {
    }
}