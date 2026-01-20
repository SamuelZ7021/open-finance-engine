package com.backend.application.service;

import com.backend.BaseIntegrationTest;
import com.backend.application.dto.TransferCommand;
import com.backend.domain.model.Account;
import com.backend.domain.model.types.AccountType;
import com.backend.application.port.out.AccountPort;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class TransferServiceIT extends BaseIntegrationTest {

    @Autowired
    private TransferService transferService;

    @Autowired
    private AccountPort accountPort;

    @Test
    @Transactional // Mantiene el aislamiento en la DB de prueba
    @DisplayName("Should execute a successful transfer between two accounts")
    void shouldExecuteTransferSuccessfully() {
        UUID sourceId = UUID.randomUUID();
        UUID targetId = UUID.randomUUID();

        // Creamos cuentas tipo LIABILITY
        Account source = new Account(sourceId, "ACC-001", UUID.randomUUID(), AccountType.LIABILITY, new BigDecimal("1000.00"), true, null);
        Account target = new Account(targetId, "ACC-002", UUID.randomUUID(), AccountType.LIABILITY, new BigDecimal("500.00"), true, null);

        // FIX: Usamos save() para que los IDs existan en la base de datos real
        accountPort.save(source);
        accountPort.save(target);

        TransferCommand command = new TransferCommand(
                sourceId,
                targetId,
                new BigDecimal("200.00"),
                UUID.randomUUID().toString(), // idempotencyKey
                "Payment for services"        // description
        );

        // WHEN
        transferService.transfer(command);

        // THEN
        Account updatedSource = accountPort.loadAccount(sourceId).orElseThrow();
        Account updatedTarget = accountPort.loadAccount(targetId).orElseThrow();

        assertThat(updatedSource.getBalance()).isEqualByComparingTo("800.00");
        assertThat(updatedTarget.getBalance()).isEqualByComparingTo("700.00");
    }
}