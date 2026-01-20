package com.backend.application.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record TransferCommand(
        @NotNull(message = "Source account ID is required")
        UUID sourceAccountId,

        @NotNull(message = "Target account ID is required")
        UUID targetAccountId,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
        BigDecimal amount,

        @NotBlank(message = "Idempotency key is required")
        String idempotencyKey,

        @NotBlank(message = "Description is required")
        String description
) {
    public TransferCommand {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }
        if (sourceAccountId != null && sourceAccountId.equals(targetAccountId)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }
    }
}