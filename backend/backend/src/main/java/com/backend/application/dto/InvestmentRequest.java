package com.backend.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentRequest {
    private String symbol;
    private String name;
    private BigDecimal quantity;
    private BigDecimal price;
    private String type;
}
