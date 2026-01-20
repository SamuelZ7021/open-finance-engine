package com.backend.application.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

public record TransferRequest(
        @NotNull(message = "Source account ID is required") UUID sourceAccountId,
        @NotNull(message = "Target account ID is required") UUID targetAccountId,
        @NotNull(message = "Amount is required") @DecimalMin(value = "0.01", message = "Amount must be at least 0.01") BigDecimal amount,
        @NotNull(message = "Description is required") String description
) {}