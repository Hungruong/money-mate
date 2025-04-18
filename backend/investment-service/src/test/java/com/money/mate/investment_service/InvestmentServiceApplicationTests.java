package com.money.mate.investment_service;

import com.money.mate.investment_service.service.MarketDataService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.anyString;

@SpringBootTest
@ActiveProfiles("test")
class InvestmentServiceApplicationTests {

    @MockBean
    private MarketDataService marketDataService;

    @Test
    void contextLoads() {
        when(marketDataService.getCurrentStockPrice(anyString())).thenReturn(new BigDecimal("100"));
    }
}