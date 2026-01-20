package com.backend.infrastructure.adapter.out.persistence;

import com.backend.application.port.out.AccountPort;
import com.backend.domain.model.Account;
import com.backend.infrastructure.adapter.out.persistence.entity.AccountEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataAccountRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class AccountPersistenceAdapter implements AccountPort {

    private final SpringDataAccountRepository accountRepository;

    public AccountPersistenceAdapter(SpringDataAccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    @Override
    public void save(Account account) {
        accountRepository.save(toEntity(account));
    }

    @Override
    public Optional<Account> loadAccount(UUID id) {
        return accountRepository.findById(id)
                .map(this::toDomain);
    }

    @Override
    public void updateAccount(Account account) {
        AccountEntity entity = accountRepository.findById(account.getId())
                .orElseThrow(() -> new IllegalStateException("Account ID " + account.getId() + " not found during update"));

        // 2. Actualizamos SOLO los campos mutables
        // Nota: No actualizamos 'createdAt' ni 'accountNumber' ni 'ownerId' porque son inmutables en negocio.
        entity.setBalance(account.getBalance());
        entity.setActive(account.isActive());

        // El campo 'version' lo maneja JPA automáticamente al hacer save().
        accountRepository.save(entity);
    }

    @Override
    public void updateAccountBalance(UUID uuid, BigDecimal amount) {
        AccountEntity entity = accountRepository.findById(uuid)
                .orElseThrow(() -> new IllegalStateException("Account ID " + uuid + " not found during balance update"));

        entity.setBalance(entity.getBalance().add(amount));
        accountRepository.save(entity);
    }

    @Override
    public List<Account> findByOwnerId(UUID ownerId) {
        return accountRepository.findByOwnerId(ownerId)
                .stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public Optional<Account> findByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .map(this::toDomain);
    }

    private Account toDomain(AccountEntity entity) {
        return new Account(
                entity.getId(),
                entity.getAccountNumber(),
                entity.getOwnerId(),
                entity.getType(),
                entity.getBalance(),
                entity.isActive(),
                entity.getCreatedAt()
        );
    }

    private AccountEntity toEntity(Account domain) {
        AccountEntity entity = new AccountEntity();
        entity.setId(domain.getId());
        entity.setAccountNumber(domain.getAccountNumber());
        entity.setOwnerId(domain.getOwnerId());
        entity.setType(domain.getType());
        entity.setBalance(domain.getBalance());
        entity.setActive(domain.isActive());
        entity.setCreatedAt(domain.getCreatedAt());
        return entity;
    }
}
