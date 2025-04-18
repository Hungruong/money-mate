package com.money.mate.investment_service.controller;

import com.money.mate.investment_service.entity.StockSearchResult;
import com.money.mate.investment_service.service.MarketDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    
    private final MarketDataService marketDataService;

    public SearchController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    @GetMapping("/stocks")
    public ResponseEntity<List<StockSearchResult>> searchStocks(@RequestParam String query) {
        try {
            List<StockSearchResult> results = marketDataService.searchStocks(query);
            return ResponseEntity.ok(results);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(null);
        }
    }
}