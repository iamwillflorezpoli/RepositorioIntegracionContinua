package com.registroautos.domain.port.out;

import com.registroautos.domain.model.User;

import java.util.Optional;

public interface UserRepositoryPort {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    User save(User user);
}
