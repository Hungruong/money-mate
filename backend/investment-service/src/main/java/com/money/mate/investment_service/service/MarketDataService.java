package com.money.mate.investment_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Service
public class MarketDataService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${alpha.vantage.api.key}")
    private String apiKey; // Store your API key in application.properties

    public MarketDataService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public BigDecimal getCurrentStockPrice(String symbol) {
        String url = String.format(
            "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=%s&apikey=%s",
            symbol, apiKey
        );

        try {
            String response = restTemplate.getForObject(url, String.class);
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode globalQuote = jsonNode.get("Global Quote");

            if (globalQuote != null && globalQuote.has("05. price")) {
                return new BigDecimal(globalQuote.get("05. price").asText());
            } else {
                throw new RuntimeException("No price data available for symbol: " + symbol);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch market data for symbol: " + symbol, e);
        }
    }
}