// Archivo: backend/src/test/java/com/backend/infrastructure/adapter/in/web/TransactionControllerIT.java
package com.backend.infrastructure.adapter.in.web;

import com.backend.BaseIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class TransactionControllerIT extends BaseIntegrationTest {

    @Autowired private MockMvc mockMvc;




    @Test
    @WithMockUser(username = "samuel@dev.com")
    @DisplayName("Debe devolver 403 al intentar ver el historial de una cuenta ajena")
    void shouldForbiddenAlienHistory() throws Exception {
        UUID alienAccount = UUID.randomUUID();

        // URL CORREGIDA: se añade /history/
        mockMvc.perform(get("/api/v1/transactions/history/" + alienAccount))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.title").value("Security Access Error"));
    }
}