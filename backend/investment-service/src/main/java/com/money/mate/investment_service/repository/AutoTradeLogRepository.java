package com.money.mate.investment_service.repository;

import com.money.mate.investment_service.entity.AutoTradeLog;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;
import software.amazon.awssdk.services.dynamodb.model.AttributeValue;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Repository
public class AutoTradeLogRepository {
    private final DynamoDbClient dynamoDbClient;
    private static final String TABLE_NAME = "auto_trade_logs";

    public AutoTradeLogRepository(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
    }

    // Convert AutoTradeLog to DynamoDB attributes
    private Map<String, AttributeValue> toAttributeMap(AutoTradeLog log) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("logId", AttributeValue.builder().s(log.getLogId().toString()).build());
        item.put("userId", AttributeValue.builder().s(log.getUserId().toString()).build());
        item.put("investmentId", AttributeValue.builder().s(log.getInvestmentId().toString()).build());
        item.put("symbol", AttributeValue.builder().s(log.getSymbol()).build());
        item.put("buyPrice", AttributeValue.builder().n(log.getBuyPrice().toString()).build());
        item.put("sellPrice", log.getSellPrice() != null ? AttributeValue.builder().n(log.getSellPrice().toString()).build() : AttributeValue.builder().nul(true).build());
        item.put("profitLoss", log.getProfitLoss() != null ? AttributeValue.builder().n(log.getProfitLoss().toString()).build() : AttributeValue.builder().nul(true).build());
        item.put("status", AttributeValue.builder().s(log.getStatus()).build());
        item.put("tradeStartedAt", AttributeValue.builder().s(log.getTradeStartedAt().toString()).build());
        item.put("tradeCompletedAt", log.getTradeCompletedAt() != null ? AttributeValue.builder().s(log.getTradeCompletedAt().toString()).build() : AttributeValue.builder().nul(true).build());
        return item;
    }

    // Save AutoTradeLog to DynamoDB
    public void save(AutoTradeLog log) {
        PutItemRequest request = PutItemRequest.builder()
                .tableName(TABLE_NAME)
                .item(toAttributeMap(log))
                .build();
        dynamoDbClient.putItem(request);
    }

    // Retrieve AutoTradeLog from DynamoDB
    public Optional<AutoTradeLog> findById(UUID logId) {
        GetItemRequest request = GetItemRequest.builder()
                .tableName(TABLE_NAME)
                .key(Collections.singletonMap("logId", AttributeValue.builder().s(logId.toString()).build()))
                .build();
        GetItemResponse response = dynamoDbClient.getItem(request);
        return response.hasItem() ? Optional.of(fromAttributeMap(response.item())) : Optional.empty();
    }

    // Convert DynamoDB attributes to AutoTradeLog
    private AutoTradeLog fromAttributeMap(Map<String, AttributeValue> item) {
        return AutoTradeLog.builder()
                .logId(UUID.fromString(item.get("logId").s()))
                .userId(UUID.fromString(item.get("userId").s()))
                .investmentId(UUID.fromString(item.get("investmentId").s()))
                .symbol(item.get("symbol").s())
                .buyPrice(new BigDecimal(item.get("buyPrice").n()))
                .sellPrice(item.containsKey("sellPrice") && !item.get("sellPrice").nul() ? new BigDecimal(item.get("sellPrice").n()) : null)
                .profitLoss(item.containsKey("profitLoss") && !item.get("profitLoss").nul() ? new BigDecimal(item.get("profitLoss").n()) : null)
                .status(item.get("status").s())
                .tradeStartedAt(Instant.parse(item.get("tradeStartedAt").s()))
                .tradeCompletedAt(item.containsKey("tradeCompletedAt") && !item.get("tradeCompletedAt").nul() ? Instant.parse(item.get("tradeCompletedAt").s()) : null)
                .build();
    }
}
