package com.backend.infrastructure.adapter.out.persistence;

import com.backend.application.port.out.RefreshTokenPort;
import com.backend.infrastructure.adapter.out.persistence.entity.RefreshTokenEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataRefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class RefreshTokenPersistenceAdapter implements RefreshTokenPort {

    private final SpringDataRefreshTokenRepository repository;

    @Override
    public void save(RefreshTokenEntity refreshToken) {
        repository.save(refreshToken);
    }

    @Override
    public Optional<RefreshTokenEntity> findByToken(String token) {
        return repository.findByToken(token);
    }

    @Override
    public void delete(RefreshTokenEntity refreshToken) {
        repository.delete(refreshToken);
    }
}