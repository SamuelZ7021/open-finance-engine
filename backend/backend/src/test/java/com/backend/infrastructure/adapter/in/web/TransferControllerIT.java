// Archivo: backend/src/test/java/com/backend/infrastructure/adapter/in/web/TransferControllerIT.java
package com.backend.infrastructure.adapter.in.web;

import com.backend.BaseIntegrationTest;
import com.backend.application.dto.TransferRequest;
import com.backend.application.port.out.AccountPort;
import com.backend.application.port.out.UserPort;
import com.backend.domain.model.Account;
import com.backend.domain.model.types.AccountType;
import com.backend.infrastructure.adapter.out.persistence.entity.UserEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.TestExecutionEvent;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TransferControllerIT extends BaseIntegrationTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private AccountPort accountPort;

    @Autowired private UserPort userPort; // Para guardar el usuario real

    @BeforeEach
    void setUp() {
        // Aseguramos que el usuario del test exista en la DB de Testcontainers
        if (userPort.findByEmail("owner@test.com").isEmpty()) {
            userPort.save(UserEntity.builder()
                    .email("owner@test.com")
                    .password("password") // El password no importa para @WithUserDetails
                    .role(UserEntity.Role.USER)
                    .build());
        }
    }

    @Test
    @WithUserDetails(value = "owner@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void shouldFailWhenAccountNotOwned() throws Exception {
        UUID alienAccountId = UUID.randomUUID();

        // Creamos la cuenta pero con un dueño distinto al del WithMockUser
        accountPort.save(new Account(alienAccountId, "ALN-1", UUID.randomUUID(), AccountType.LIABILITY, new BigDecimal("100.0"), true, LocalDateTime.now()));

        var request = new TransferRequest(
                alienAccountId, UUID.randomUUID(), new BigDecimal("10.00"), "Fraud attempt"
        );

        mockMvc.perform(post("/api/v1/transfers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden()); // Validado por verifyAccountOwnership
    }

    @Test
    @WithUserDetails(value = "owner@test.com", setupBefore = TestExecutionEvent.TEST_EXECUTION)
    void shouldTransferByAccountNumber() throws Exception {
        UUID ownerId = userPort.findByEmail("owner@test.com").get().getId();
        UUID sourceId = UUID.randomUUID();
        UUID targetId = UUID.randomUUID();
        String targetNumber = "TARGET-123";

        // Setup accounts
        accountPort.save(new Account(sourceId, "SRC-1", ownerId, AccountType.LIABILITY, new BigDecimal("100.00"), true, LocalDateTime.now()));
        accountPort.save(new Account(targetId, targetNumber, UUID.randomUUID(), AccountType.ASSET, new BigDecimal("0.00"), true, LocalDateTime.now()));

        var request = new TransferController.TransferByNumberRequest(
                sourceId, targetNumber, new BigDecimal("50.00"), "Transfer by number"
        );

        mockMvc.perform(post("/api/v1/transfers/number")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }
}
