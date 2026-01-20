package com.backend.application.service;

import com.backend.application.dto.TransferCommand;
import com.backend.application.port.out.AccountPort;
import com.backend.application.port.out.TransactionPort;
import com.backend.domain.model.Account;
import com.backend.domain.model.types.AccountType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransferServiceTest {

    @Mock
    private AccountPort accountPort;

    @Mock
    private TransactionPort transactionPort;

    @InjectMocks
    private TransferService transferService;

    @Test
    @DisplayName("Should execute transfer successfully between two liability accounts")
    void executeSuccessfulTransfer() {
        // GIVEN
        UUID sourceId = UUID.randomUUID();
        UUID targetId = UUID.randomUUID();
        UUID ownerId = UUID.randomUUID();

        // Creamos cuentas tipo LIABILITY para que debit reste y credit sume
        Account source = new Account(sourceId, "SRC-123", ownerId, AccountType.LIABILITY, new BigDecimal("100.00"), true, null);
        Account target = new Account(targetId, "TGT-123", ownerId, AccountType.LIABILITY, new BigDecimal("50.00"), true, null);

        // ORDEN CORRECTO: amount, idempotencyKey, description
        TransferCommand command = new TransferCommand(
                sourceId,
                targetId,
                new BigDecimal("30.00"),
                "key-123",        // idempotencyKey
                "Test Transfer"   // description
        );

        when(accountPort.loadAccount(sourceId)).thenReturn(Optional.of(source));
        when(accountPort.loadAccount(targetId)).thenReturn(Optional.of(target));
        when(transactionPort.existsByIdempotencyKey("key-123")).thenReturn(false);

        // WHEN
        transferService.transfer(command);

        // THEN
        // Usamos compareTo para ignorar problemas de escala en BigDecimal (70 vs 70.00)
        verify(accountPort).updateAccount(argThat(acc ->
                acc.getId().equals(sourceId) && acc.getBalance().compareTo(new BigDecimal("70.00")) == 0));

        verify(accountPort).updateAccount(argThat(acc ->
                acc.getId().equals(targetId) && acc.getBalance().compareTo(new BigDecimal("80.00")) == 0));

        verify(transactionPort).save(any());
    }
}