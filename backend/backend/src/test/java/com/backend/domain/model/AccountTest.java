package com.backend.domain.model;

import com.backend.domain.model.types.AccountType;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;

class AccountTest {

    @Test
    @DisplayName("Should decrease balance when debit is valid")
    void debitSuccess() {
        Account account = createTestAccount(new BigDecimal("100.00"));
        account.debit(new BigDecimal("40.00"));
        assertEquals(new BigDecimal("60.00"), account.getBalance());
    }

    private Account createTestAccount(BigDecimal balance) {
        // FIX: Pasar AccountType.LIABILITY explícitamente
        return new Account(
                UUID.randomUUID(),
                "12345",
                UUID.randomUUID(),
                AccountType.LIABILITY, // <--- CAMBIO AQUÍ
                balance,
                true,
                LocalDateTime.now()
        );
    }

    @Test
    void debitInsufficientFunds() {
        Account account = createTestAccount(new BigDecimal("10.00"));
        // FIX: Esperar IllegalStateException, que es la que lanza el dominio
        assertThrows(IllegalStateException.class, () -> account.debit(new BigDecimal("20.00")));
    }
}