package com.registroautos.infrastructure.adapter.in.api;

import com.registroautos.application.dto.auth.AuthResponse;
import com.registroautos.application.dto.auth.LoginRequest;
import com.registroautos.application.dto.auth.RegisterRequest;
import com.registroautos.domain.port.in.AuthUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthUseCase authUseCase;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authUseCase.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authUseCase.login(request);
    }
}
