package com.backend.infrastructure.adapter.in.web;

import com.backend.application.dto.AccountResponse;
import com.backend.application.port.in.AccountUseCase;
import com.backend.application.port.out.AccountPort;
import com.backend.infrastructure.adapter.out.persistence.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountUseCase accountUseCase;
    private final AccountPort accountPort;

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getMyAccounts(@AuthenticationPrincipal UserEntity user) {
        return ResponseEntity.ok(accountUseCase.getAccountsForUser(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccountById(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable UUID id) {
        // Verificar que el usuario es el propietario de la cuenta
        accountUseCase.verifyAccountOwnership(user.getId(), id);

        // Devolver la cuenta con transacciones
        return ResponseEntity.ok(accountUseCase.getAccountDetails(id));
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @AuthenticationPrincipal UserEntity user,
            @RequestBody CreateAccountRequest request) {
        if (request.accountNumber() == null || request.accountNumber().isBlank()) {
            throw new IllegalArgumentException("Account number cannot be empty");
        }
        // Validacion de tipo podria ser opcional si lo forzamos, pero por ahora lo dejamos
        // El frontend enviara Liability si arreglamos el frontend.
        
        com.backend.domain.model.types.AccountType type = request.type();
        if (type == null) {
             throw new IllegalArgumentException("Account type is required");
        }

        // Crear la nueva cuenta
        com.backend.domain.model.Account account = new com.backend.domain.model.Account(
                UUID.randomUUID(),
                request.accountNumber(),
                user.getId(),
                type
        );

        accountPort.save(account);

        return ResponseEntity.status(HttpStatus.CREATED).body(new AccountResponse(
                account.getId(),
                account.getAccountNumber(),
                account.getType(),
                account.getBalance(),
                account.isActive(),
                Collections.emptyList()
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable UUID id) {
        // Verificar que el usuario es el propietario de la cuenta
        accountUseCase.verifyAccountOwnership(user.getId(), id);

        // Cargar la cuenta y marcarla como inactiva (soft delete)
        com.backend.domain.model.Account account = accountPort.loadAccount(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        if (!account.isActive()) {
            throw new IllegalStateException("Account is already deleted or inactive");
        }

        // Crear una nueva instancia con la cuenta marcada como inactiva
        com.backend.domain.model.Account inactiveAccount = new com.backend.domain.model.Account(
                account.getId(),
                account.getAccountNumber(),
                account.getOwnerId(),
                account.getType(),
                account.getBalance(),
                false, // Marcar como inactiva
                account.getCreatedAt()
        );

        accountPort.updateAccount(inactiveAccount);

        return ResponseEntity.noContent().build();
    }

    public record CreateAccountRequest(
            String accountNumber,
            com.backend.domain.model.types.AccountType type
    ) {}
}
