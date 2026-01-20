package com.backend.infrastructure.adapter.in.web;

import com.backend.application.dto.AuthRequest;
import com.backend.application.dto.AuthResponse;
import com.backend.application.dto.RegisterRequest;
import com.backend.application.service.AuthService;
import com.backend.application.service.RefreshTokenService;
import com.backend.infrastructure.adapter.out.persistence.entity.UserEntity;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody RegisterRequest request) {
        // Validaciones
        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        if (request.password() == null || request.password().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }
        if (request.fullName() == null || request.fullName().isBlank()) {
            throw new IllegalArgumentException("Full name cannot be empty");
        }

        authService.register(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request, HttpServletResponse response) {
        // Validaciones
        if (request.email() == null || request.email().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.password() == null || request.password().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        // 1. Autenticamos y obtenemos el objeto de autenticación REAL
        Authentication auth = authService.authenticateAndGetAuth(request);

        // 2. Generamos el token de acceso
        String accessToken = authService.generateTokenFromAuth(auth);

        // 3. Generamos el refresh token usando el objeto auth que ya tenemos
        String refreshToken = authService.createRefreshToken(auth);

        // Configuración de cookie para el Refresh Token
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(false); // Cambiar a true en producción (HTTPS)
        cookie.setPath("/");
        cookie.setMaxAge(604800);
        response.addCookie(cookie);

        UserEntity user = (UserEntity) auth.getPrincipal();
        return ResponseEntity.ok(new AuthResponse(accessToken, user.toDTO()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @CookieValue(value = "refresh_token", required = false) String refreshToken) {
        if (refreshToken == null) {
            throw new IllegalArgumentException("Refresh token is missing from cookies");
        }
        return ResponseEntity.ok(authService.refreshAccessToken(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @AuthenticationPrincipal UserEntity user,
            @CookieValue(value = "refresh_token", required = false) String refreshToken,
            HttpServletResponse response) {

        if (refreshToken != null) {
            // Revocar el refresh token
            refreshTokenService.revokeToken(refreshToken);
        }

        // Limpiar la cookie del refresh token
        Cookie cookie = new Cookie("refresh_token", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(false);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Esto elimina la cookie
        response.addCookie(cookie);

        return ResponseEntity.ok().build();
    }
}