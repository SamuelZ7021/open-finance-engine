package com.backend.application.dto;

import com.backend.domain.model.types.AccountType;
import java.math.BigDecimal;
import java.util.UUID;

public record AccountResponse(
        UUID id,
        String accountNumber,
        AccountType type,
        BigDecimal balance,
        boolean active,
        java.util.List<AccountTransactionResponse> transactions
) {}