package com.backend.infrastructure.adapter.in.web;

import com.backend.application.dto.TransferCommand;
import com.backend.application.dto.TransferRequest;
import com.backend.application.port.in.AccountUseCase;
import com.backend.application.port.in.TransferUseCase;
import com.backend.infrastructure.adapter.out.persistence.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transfers")
@RequiredArgsConstructor
public class TransferController {

    private final TransferUseCase transferUseCase;
    private final AccountUseCase accountUseCase;

    @PostMapping
    public ResponseEntity<Void> transfer(
            @AuthenticationPrincipal UserEntity user,
            @RequestBody TransferRequest request) {

        // Validaciones
        if (request.sourceAccountId() == null || request.targetAccountId() == null) {
            throw new IllegalArgumentException("Source and target account IDs are required");
        }

        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }

        if (request.sourceAccountId().equals(request.targetAccountId())) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        if (request.description() == null || request.description().isBlank()) {
            throw new IllegalArgumentException("Transfer description cannot be empty");
        }

        // Verificar que el usuario es el propietario de la cuenta origen
        accountUseCase.verifyAccountOwnership(user.getId(), request.sourceAccountId());

        // Ejecutar la transferencia
        TransferCommand command = new TransferCommand(
                request.sourceAccountId(),
                request.targetAccountId(),
                request.amount(),
                UUID.randomUUID().toString(),
                request.description()
        );

        try {
            transferUseCase.transfer(command);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Transfer failed: " + e.getMessage());
        }
    }

    public record TransferRequest(
            java.util.UUID sourceAccountId,
            java.util.UUID targetAccountId,
            BigDecimal amount,
            String description
    ) {}

    @PostMapping("/number")
    public ResponseEntity<Void> transferByNumber(
            @AuthenticationPrincipal UserEntity user,
            @RequestBody TransferByNumberRequest request) {

        if (request.sourceAccountId() == null) {
            throw new IllegalArgumentException("Source account ID is required");
        }
        if (request.targetAccountNumber() == null || request.targetAccountNumber().isBlank()) {
            throw new IllegalArgumentException("Target account number is required");
        }
        if (request.amount() == null || request.amount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }
        if (request.description() == null || request.description().isBlank()) {
            throw new IllegalArgumentException("Transfer description cannot be empty");
        }

        accountUseCase.verifyAccountOwnership(user.getId(), request.sourceAccountId());

        // Resolve target account by number
        var targetAccount = accountUseCase.getAccountByNumber(request.targetAccountNumber());

        if (request.sourceAccountId().equals(targetAccount.getId())) {
             throw new IllegalArgumentException("Cannot transfer to the same account");
        }

        TransferCommand command = new TransferCommand(
                request.sourceAccountId(),
                targetAccount.getId(),
                request.amount(),
                UUID.randomUUID().toString(),
                request.description()
        );

        transferUseCase.transfer(command);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public record TransferByNumberRequest(
            java.util.UUID sourceAccountId,
            String targetAccountNumber,
            BigDecimal amount,
            String description
    ) {}
}
