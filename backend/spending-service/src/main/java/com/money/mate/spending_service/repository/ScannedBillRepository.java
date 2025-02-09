package com.money.mate.spending_service.repository;

import com.money.mate.spending_service.entity.ScannedBill;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.*;

@Repository
public class ScannedBillRepository {

    private final DynamoDbClient dynamoDbClient;
    private final String tableName = "scanned_bills";

    public ScannedBillRepository(DynamoDbClient dynamoDbClient) {
        this.dynamoDbClient = dynamoDbClient;
    }

    public void save(ScannedBill bill) {
        PutItemRequest request = PutItemRequest.builder()
                .tableName(tableName)
                .item(Map.of(
                        "billId", AttributeValue.builder().s(bill.getBillId().toString()).build(),
                        "userId", AttributeValue.builder().s(bill.getUserId().toString()).build(),
                        "receiptUrl", AttributeValue.builder().s(bill.getReceiptUrl()).build(),
                        "extractedText", AttributeValue.builder().s(bill.getExtractedText()).build()))
                .build();

        dynamoDbClient.putItem(request);
    }

    public List<ScannedBill> findByUserId(UUID userId) {
        ScanRequest scanRequest = ScanRequest.builder()
                .tableName(tableName)
                .filterExpression("userId = :userId")
                .expressionAttributeValues(Map.of(":userId",
                        AttributeValue.builder().s(userId.toString()).build()))
                .build();

        ScanResponse response = dynamoDbClient.scan(scanRequest);

        return response.items().stream()
                .map(item -> new ScannedBill(
                        UUID.fromString(item.get("billId").s()),
                        UUID.fromString(item.get("userId").s()),
                        item.get("receiptUrl").s(),
                        item.get("extractedText").s()))
                .toList();
    }
}