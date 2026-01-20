package com.backend.application.dto;

import com.backend.domain.model.types.OperationType;

import java.math.BigDecimal;
import java.util.UUID;

public record TransactionLineResponse(
        UUID accountId,
        BigDecimal amount,
        OperationType type
) {}
