package com.backend.application.dto;

public record AuthResponse(
    String accessToken,
    UserDTO user
) {
}
