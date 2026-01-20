package com.backend.application.service;

import com.backend.application.dto.AuthRequest;
import com.backend.application.dto.AuthResponse;
import com.backend.application.dto.RegisterRequest;
import com.backend.infrastructure.adapter.out.persistence.entity.UserEntity;
import com.backend.infrastructure.adapter.out.persistence.repository.SpringDataUserRepository;
import com.backend.infrastructure.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final SpringDataUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;

    public void register(RegisterRequest request) {
        var user = UserEntity.builder()
                .id(UUID.randomUUID())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .role(UserEntity.Role.USER)
                .build();
        userRepository.save(user);
    }

 
    public Authentication authenticateAndGetAuth(AuthRequest request) {
        return authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
    }
    
    public String generateTokenFromAuth(Authentication auth) {
        UserEntity user = (UserEntity) auth.getPrincipal();
        return jwtService.generateToken(user);
    }

    public String createRefreshToken(Authentication auth) {
        UserEntity user = (UserEntity) auth.getPrincipal();
        return refreshTokenService.createRefreshToken(user.getEmail()).getToken();
    }

    public AuthResponse refreshAccessToken(String token) {
        return refreshTokenService.findByToken(token)
                .map(refreshTokenService::verifyExpiration)
                .map(rt -> {
                    String accessToken = jwtService.generateToken(rt.getUser());
                    return new AuthResponse(accessToken, rt.getUser().toDTO());
                })
                .orElseThrow(() -> new RuntimeException("Refresh token invalid"));
    }
}