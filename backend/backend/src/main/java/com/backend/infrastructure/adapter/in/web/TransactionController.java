package com.backend.infrastructure.adapter.in.web;

import com.backend.application.dto.TransactionLineResponse;
import com.backend.application.dto.TransactionResponse;
import com.backend.application.port.in.AccountUseCase;
import com.backend.application.port.out.TransactionPort;
import com.backend.infrastructure.adapter.out.persistence.entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {
    private final TransactionPort transactionPort;
    private final AccountUseCase accountUseCase;

    @GetMapping("/history/{accountId}")
    public ResponseEntity<List<TransactionResponse>> getHistory(
            @AuthenticationPrincipal UserEntity user,
            @PathVariable UUID accountId) {

        // 1. Validamos propiedad en el servicio de cuentas (Lógica de Negocio)
        accountUseCase.verifyAccountOwnership(user.getId(), accountId);

        // 2. Si la validación pasa, consultamos el historial
        List<TransactionResponse> response = transactionPort.findByAccountId(accountId).stream()
                .map(tx -> new TransactionResponse(
                        tx.getId(),
                        tx.getTimestamp(),
                        tx.getDescription(),
                        tx.getLines().stream()
                                .map(l -> new TransactionLineResponse(l.accountId(), l.amount(), l.type()))
                                .toList()
                )).toList();

        return ResponseEntity.ok(response);
    }
}
