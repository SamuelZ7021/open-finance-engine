package com.backend.application.port.out;

import com.backend.domain.model.LedgerTransaction;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionPort {

    void save(LedgerTransaction transaction);
    boolean existsByIdempotencyKey(String key);
    Optional<LedgerTransaction> findById(UUID id);
    List<LedgerTransaction> findByAccountId(UUID accountId);
}
