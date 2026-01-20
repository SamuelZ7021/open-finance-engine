package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.AccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SpringDataAccountRepository extends JpaRepository<AccountEntity, UUID> {
    List<AccountEntity> findByOwnerId(UUID ownerId);
    java.util.Optional<AccountEntity> findByAccountNumber(String accountNumber);
}
