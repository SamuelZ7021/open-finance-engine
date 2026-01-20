package com.backend.infrastructure.adapter.out.persistence;

import com.backend.application.port.out.InvestmentPort;
import com.backend.domain.model.Investment;
import com.backend.infrastructure.adapter.out.persistence.entity.InvestmentEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataInvestmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class InvestmentPersistenceAdapter implements InvestmentPort {

    private final SpringDataInvestmentRepository repository;

    @Override
    public Investment save(Investment investment) {
        InvestmentEntity entity = mapToEntity(investment);
        InvestmentEntity saved = repository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public List<Investment> findByUserId(UUID userId) {
        return repository.findByUserId(userId).stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Investment> findByUserIdAndSymbol(UUID userId, String symbol) {
        return repository.findByUserIdAndSymbol(userId, symbol)
                .map(this::mapToDomain);
    }
    
    @Override
    public void delete(UUID id) {
        repository.deleteById(id);
    }

    private InvestmentEntity mapToEntity(Investment domain) {
        return new InvestmentEntity(
                domain.getId(),
                domain.getUserId(),
                domain.getSymbol(),
                domain.getName(),
                domain.getQuantity(),
                domain.getAveragePrice(),
                domain.getCurrentPrice(),
                domain.getType(),
                domain.getImageUrl(),
                domain.getLastUpdated()
        );
    }

    private Investment mapToDomain(InvestmentEntity entity) {
        return Investment.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .symbol(entity.getSymbol())
                .name(entity.getName())
                .quantity(entity.getQuantity())
                .averagePrice(entity.getAveragePrice())
                .currentPrice(entity.getCurrentPrice())
                .type(entity.getType())
                .imageUrl(entity.getImageUrl())
                .lastUpdated(entity.getLastUpdated())
                .build();
    }
}
