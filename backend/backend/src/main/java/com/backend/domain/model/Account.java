package com.backend.domain.model;

import com.backend.domain.model.types.AccountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class Account {
    private final UUID id;
    private final String accountNumber;
    private final UUID ownerId; // Referencia al User
    private final AccountType type;
    private BigDecimal balance; // Snapshot del saldo
    private boolean active;
    private LocalDateTime createdAt;

    public Account(UUID id, String accountNumber, UUID ownerId, AccountType type) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.ownerId = ownerId;
        this.type = type;
        this.balance = BigDecimal.ZERO;
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

    // Constructor para persistencia (Cargar desde DB)
    public Account(UUID id, String accountNumber, UUID ownerId, AccountType type, BigDecimal balance, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.ownerId = ownerId;
        this.type = type;
        this.balance = (balance == null) ? BigDecimal.ZERO : balance;
        this.active = active;
        this.createdAt = createdAt;
    }

    // -- logic to domain --
    public void debit(BigDecimal amount) {
        if (!active) throw new IllegalStateException("Account is inactive");
        if (amount.compareTo(BigDecimal.ZERO) <= 0) throw new IllegalArgumentException("Amount must be positive");

        // Regla: Si es Pasivo (Cuenta de usuario), Debit DISMINUYE el saldo.
        // Si es Activo (Caja del banco), Debit AUMENTA el saldo.
        if (this.type == AccountType.LIABILITY) {
            if (this.balance.compareTo(amount) < 0) {
                throw new IllegalStateException("Insufficient funds for account " + this.id);
            }
            this.balance = this.balance.subtract(amount);
        } else {
            this.balance = this.balance.add(amount);
        }
    }

    public void credit(BigDecimal amount){
        if(!active) throw new IllegalStateException("Account is inactive");
        if (amount.compareTo(BigDecimal.ZERO) <= 0 ) throw new IllegalStateException("Amount must be positive");

        if(this.type == AccountType.LIABILITY){
            this.balance = this.balance.add(amount);
        } else {
            this.balance = this.balance.subtract(amount);
        }
    }

    public UUID getId() {
        return id;
    }
    public String getAccountNumber() {
        return accountNumber;
    }
    public AccountType getType() {
        return type;
    }
    public BigDecimal getBalance() {
        return balance;
    }
    public boolean isActive() {
        return active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public UUID getOwnerId() {
        return ownerId;
    }
}
