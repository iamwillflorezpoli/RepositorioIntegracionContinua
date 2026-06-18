package com.registroautos.domain.port.out;

import com.registroautos.domain.model.User;

public interface TokenProviderPort {

    String generateToken(User user);
}
