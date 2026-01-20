package com.backend.infrastructure.adapter.out.persistence.repository;

import com.backend.infrastructure.adapter.out.persistence.entity.InvestmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpringDataInvestmentRepository extends JpaRepository<InvestmentEntity, UUID> {
    List<InvestmentEntity> findByUserId(UUID userId);
    Optional<InvestmentEntity> findByUserIdAndSymbol(UUID userId, String symbol);
}
