package com.money.mate.investment_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.money.mate.investment_service.entity.StockSearchResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class MarketDataService {

    private static final Logger logger = LoggerFactory.getLogger(MarketDataService.class);
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${alpha.vantage.api.key}")
    private String apiKey;

    public MarketDataService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public BigDecimal getCurrentStockPrice(String symbol) {
        String url = String.format(
                "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=%s&apikey=%s",
                symbol, apiKey);

        try {
            logger.debug("Fetching stock price for symbol: {}", symbol);
            String response = restTemplate.getForObject(url, String.class);
            if (response == null) {
                logger.warn("No response received for stock price query: {}", symbol);
                return null;
            }

            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode globalQuote = jsonNode.get("Global Quote");

            if (globalQuote != null && globalQuote.has("05. price")) {
                BigDecimal price = new BigDecimal(globalQuote.get("05. price").asText());
                logger.debug("Stock price for {}: {}", symbol, price);
                return price;
            } else {
                logger.warn("No price data found in response for symbol: {}", symbol);
                return null;
            }
        } catch (Exception e) {
            logger.error("Failed to fetch stock price for symbol: {}", symbol, e);
            return null; // Graceful fallback
        }
    }

    public List<StockSearchResult> searchStocks(String query) {
        String url = String.format(
                "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=%s&apikey=%s",
                query, apiKey);

        try {
            logger.info("Searching stocks for query: {}", query);
            String response = restTemplate.getForObject(url, String.class);
            if (response == null) {
                logger.error("No response received from Alpha Vantage API for query: {}", query);
                return new ArrayList<>(); // Return empty list instead of throwing exception
            }

            logger.debug("API Response: {}", response);
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode bestMatches = jsonNode.get("bestMatches");

            List<StockSearchResult> results = new ArrayList<>();
            if (bestMatches != null && bestMatches.isArray()) {
                for (JsonNode match : bestMatches) {
                    String symbol = match.get("1. symbol").asText();
                    String name = match.get("2. name").asText();
                    BigDecimal price = getCurrentStockPrice(symbol); // Fetch price for each symbol
                    results.add(new StockSearchResult(symbol, name, price));
                    logger.debug("Added stock: {} - {} - Price: {}", symbol, name, price);
                }
            } else {
                logger.warn("No 'bestMatches' found in response for query: {}", query);
            }
            logger.info("Returning {} stock results for query: {}", results.size(), query);
            return results;
        } catch (Exception e) {
            logger.error("Failed to search stocks for query: {}", query, e);
            return new ArrayList<>(); // Graceful fallback instead of throwing exception
        }
    }
}