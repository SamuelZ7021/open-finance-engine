// Archivo: backend/src/test/java/com/backend/infrastructure/adapter/in/web/AccountControllerIT.java
package com.backend.infrastructure.adapter.in.web;

import com.backend.BaseIntegrationTest;
import com.backend.application.port.out.UserPort;
import com.backend.infrastructure.adapter.out.persistence.entity.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AccountControllerIT extends BaseIntegrationTest {

    @Autowired private MockMvc mockMvc;

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
    @WithMockUser(username = "samuel@test.com")
    void shouldListAccounts() throws Exception {
        mockMvc.perform(get("/api/v1/accounts"))
                .andExpect(status().isOk());
    }
}