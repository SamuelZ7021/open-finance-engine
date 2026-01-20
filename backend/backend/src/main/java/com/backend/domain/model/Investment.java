package com.backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Investment {
    private UUID id;
    private UUID userId;
    private String symbol;
    private String name;
    private BigDecimal quantity;
    private BigDecimal averagePrice;
    private BigDecimal currentPrice;
    private String type; // STOCK, CRYPTO, etc.
    private String imageUrl;
    private LocalDateTime lastUpdated;

    public BigDecimal getTotalValue() {
        return currentPrice.multiply(quantity);
    }

    public BigDecimal getReturnRate() {
        if (averagePrice.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return currentPrice.subtract(averagePrice)
                .divide(averagePrice, 4, java.math.RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }
}
