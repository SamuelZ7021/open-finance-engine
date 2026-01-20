package com.backend.application.port.out;

import com.backend.domain.model.Account;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccountPort {
    Optional<Account> loadAccount(UUID id);
    void updateAccount(Account account);
    void save(Account account);
    void updateAccountBalance(UUID uuid, BigDecimal amount);
    List<Account> findByOwnerId(UUID ownerId);
    Optional<Account> findByAccountNumber(String accountNumber);
}
