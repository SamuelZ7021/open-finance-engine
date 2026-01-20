package com.backend.application.port.out;

import com.backend.infrastructure.adapter.out.persistence.entity.UserEntity;
import java.util.Optional;

public interface UserPort {
    UserEntity save(UserEntity user);
    Optional<UserEntity> findByEmail(String email);
}