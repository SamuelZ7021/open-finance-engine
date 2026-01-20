package com.backend.infrastructure.adapter.out.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "ledger_transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionEntity {
    @Id
    private UUID id;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private String description;

    // Idempotency Key única para evitar duplicados exactos
    @Column(unique = true, nullable = false)
    private String idempotencyKey;

    @OneToMany(mappedBy = "transaction", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<TransactionLineEntity> lines;
}
