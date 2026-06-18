package com.registroautos.domain.port.in;

import com.registroautos.application.dto.auth.AuthResponse;
import com.registroautos.application.dto.auth.LoginRequest;
import com.registroautos.application.dto.auth.RegisterRequest;

public interface AuthUseCase {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
