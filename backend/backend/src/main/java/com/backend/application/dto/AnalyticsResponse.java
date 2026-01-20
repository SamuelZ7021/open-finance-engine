package com.backend.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class AnalyticsResponse {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BalanceHistoryPoint {
        private String month; // "Jan", "Feb" or "2023-01"
        private BigDecimal value;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyFlow {
        private String month;
        private BigDecimal income;
        private BigDecimal expenses;
    }
}
