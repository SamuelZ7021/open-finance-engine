package com.backend.application.dto;

import java.util.UUID;

public record UserDTO(
    UUID id,
    String email,
    String fullName
) {}
