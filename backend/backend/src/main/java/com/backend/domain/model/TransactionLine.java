package com.backend.domain.model;

import com.backend.domain.model.types.OperationType;
import java.math.BigDecimal;
import java.util.UUID;

public record TransactionLine(
        UUID accountId,
        BigDecimal amount,
        OperationType type
) {
    public TransactionLine {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Line amount must be positive");
        }
    }
}