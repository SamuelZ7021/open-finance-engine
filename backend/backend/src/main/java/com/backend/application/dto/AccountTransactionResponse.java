package com.backend.application.dto;

import com.backend.domain.model.types.OperationType;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record AccountTransactionResponse(
        UUID id,
        LocalDateTime timestamp,
        String description,
        BigDecimal amount,
        OperationType category
) {}
