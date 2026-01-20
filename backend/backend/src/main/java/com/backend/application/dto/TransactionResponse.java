package com.backend.application.dto;


import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record TransactionResponse(
        UUID id,
        LocalDateTime timestamp,
        String description,
        List<TransactionLineResponse> lines
) {}

