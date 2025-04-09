package com.money.mate.investment_service.entity;

import java.math.BigDecimal;
import java.util.Objects;

public class StockSearchResult {
    private String symbol;
    private String name;
    private BigDecimal price;

    // No-args constructor for Jackson/serialization
    public StockSearchResult() {}

    // Parameterized constructor
    public StockSearchResult(String symbol, String name, BigDecimal price) {
        this.symbol = symbol;
        this.name = name;
        this.price = price;
    }

    // Getters and Setters
    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    // Optional: Override toString for logging/debugging
    @Override
    public String toString() {
        return "StockSearchResult{" +
                "symbol='" + symbol + '\'' +
                ", name='" + name + '\'' +
                ", price=" + price +
                '}';
    }

    // Optional: Override equals and hashCode for consistency
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StockSearchResult that = (StockSearchResult) o;
        return Objects.equals(symbol, that.symbol) &&
                Objects.equals(name, that.name) &&
                Objects.equals(price, that.price);
    }

    @Override
    public int hashCode() {
        return Objects.hash(symbol, name, price);
    }
}