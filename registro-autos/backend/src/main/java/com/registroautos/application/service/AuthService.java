package com.registroautos.application.service;

import com.registroautos.application.dto.auth.AuthResponse;
import com.registroautos.application.dto.auth.LoginRequest;
import com.registroautos.application.dto.auth.RegisterRequest;
import com.registroautos.application.dto.auth.UserResponse;
import com.registroautos.domain.port.in.AuthUseCase;
import com.registroautos.domain.port.out.TokenProviderPort;
import com.registroautos.domain.port.out.UserRepositoryPort;
import com.registroautos.application.exception.ConflictException;
import com.registroautos.application.exception.UnauthorizedException;
import com.registroautos.domain.model.Role;
import com.registroautos.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements AuthUseCase {

    private final UserRepositoryPort userRepositoryPort;
    private final TokenProviderPort tokenProviderPort;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.getEmail());

        if (userRepositoryPort.existsByEmail(email)) {
            throw new ConflictException("El correo ya se encuentra registrado");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepositoryPort.save(user);
        String token = tokenProviderPort.generateToken(savedUser);

        return buildAuthResponse(savedUser, token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());

        User user = userRepositoryPort.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Credenciales inválidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Credenciales inválidas");
        }

        String token = tokenProviderPort.generateToken(user);

        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .user(UserResponse.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .role(user.getRole().name())
                        .build())
                .build();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
