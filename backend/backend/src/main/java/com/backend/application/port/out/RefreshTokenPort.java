package com.backend.application.port.out;

import com.backend.infrastructure.adapter.out.persistence.entity.RefreshTokenEntity;

import java.util.Optional;

public interface RefreshTokenPort {
    void save(RefreshTokenEntity refreshToken);
    Optional<RefreshTokenEntity> findByToken(String token);
    void delete(RefreshTokenEntity refreshToken);
}
