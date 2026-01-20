package com.backend.domain.model;

import com.backend.domain.model.types.OperationType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

public class LedgerTransaction {
    private final UUID id;
    private final LocalDateTime timestamp;
    private final String description;
    private final String idempotencyKey;
    private final List<TransactionLine> lines;
    private final UUID parentTransactionId;
    private final Map<String, String> metadata;

    public LedgerTransaction(UUID id, String description, String idempotencyKey,
                             UUID parentTransactionId, Map<String, String> metadata) {
        this.id = id;
        this.timestamp = LocalDateTime.now();
        this.description = description;
        this.idempotencyKey = idempotencyKey;
        this.lines = new ArrayList<>();
        this.parentTransactionId = parentTransactionId;
        this.metadata = metadata != null ? metadata : new HashMap<>();
    }

    // Static factory for normal transfers
    public static LedgerTransaction create(String description, String idempotencyKey) {
        return new LedgerTransaction(UUID.randomUUID(), description, idempotencyKey, null, null);
    }

    // Static factory for reversals
    public static LedgerTransaction createReversal(String description, String idempotencyKey, UUID parentId, Map<String, String> meta) {
        return new LedgerTransaction(UUID.randomUUID(), description, idempotencyKey, parentId, meta);
    }


    public void addLine(UUID accountId, BigDecimal amount, OperationType type) {
        this.lines.add(new TransactionLine(accountId, amount, type));
    }

    private void validateAccountingEntry() {
        BigDecimal total = lines.stream()
                .map(TransactionLine::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (total.compareTo(BigDecimal.ZERO) != 0) {
            throw new IllegalStateException("Accounting entry is not balanced. Total must be zero.");
        }
    }

    // Validar la partida doble
    public void validate(){
        BigDecimal totalDebit = lines.stream()
                .filter(l -> l.type() == OperationType.DEBIT)
                .map(TransactionLine::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalCredit = lines.stream()
                .filter(l -> l.type() == OperationType.CREDIT)
                .map(TransactionLine::amount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalDebit.compareTo(totalCredit) != 0){
            throw new IllegalStateException(
                    "Double Entry Principle Violated: Debits (" + totalDebit +
                            ") != Credits (" + totalCredit + ")"
            );
        }
        if (lines.isEmpty()){
            throw new IllegalStateException("Transaction must have at least two lines");
        }
    }

    public boolean isReversal() {
        return parentTransactionId != null;
    }

    public UUID getId() {
        return id;
    }
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    public String getDescription() {
        return description;
    }
    public String getIdempotencyKey() {
        return idempotencyKey;
    }
    public List<TransactionLine> getLines() {
        return lines;
    }
}
