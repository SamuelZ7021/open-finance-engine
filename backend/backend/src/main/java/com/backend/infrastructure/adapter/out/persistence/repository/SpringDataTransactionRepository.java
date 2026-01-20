package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.TransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SpringDataTransactionRepository extends JpaRepository<TransactionEntity, UUID> {
    boolean existsByIdempotencyKey(String idempotencyKey);

    @Query("SELECT DISTINCT t FROM TransactionEntity t JOIN t.lines l WHERE l.accountId = :accountId ORDER BY t.timestamp DESC")
    List<TransactionEntity> findAllByAccountId(@Param("accountId") UUID accountId);
}
