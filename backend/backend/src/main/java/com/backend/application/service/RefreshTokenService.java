package com.backend.application.service;

import com.backend.application.port.out.RefreshTokenPort;
import com.backend.application.port.out.UserPort;
import com.backend.infrastructure.adapter.out.persistence.entity.RefreshTokenEntity;
import com.backend.infrastructure.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenPort refreshTokenPort;
    private final UserPort userPort;
    private final JwtService jwtService;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

    @Transactional
    public RefreshTokenEntity createRefreshToken(String email) {
        var user = userPort.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        RefreshTokenEntity refreshToken = RefreshTokenEntity.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshExpiration))
                .revoked(false)
                .build();

        refreshTokenPort.save(refreshToken);
        return refreshToken;
    }

    public RefreshTokenEntity verifyExpiration(RefreshTokenEntity token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenPort.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }

    public java.util.Optional<RefreshTokenEntity> findByToken(String token) {
        return refreshTokenPort.findByToken(token);
    }

    @Transactional
    public void revokeToken(String token) {
        refreshTokenPort.findByToken(token).ifPresent(refreshToken -> {
            refreshToken.setRevoked(true);
            refreshTokenPort.save(refreshToken);
        });
    }
}