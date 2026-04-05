package com.beatflow.auth.security;

import com.beatflow.auth.domain.Role;
import com.beatflow.auth.domain.User;
import com.beatflow.common.security.JwtTokenService;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class JwtService {

    private final JwtTokenService jwtTokenService;

    public JwtService(JwtTokenService jwtTokenService) {
        this.jwtTokenService = jwtTokenService;
    }

    public String generateToken(User user) {
        return jwtTokenService.generateToken(user.getId().toString(),
                                             Map.of("email",
                                                    user.getEmail(),
                                                    "roles",
                                                    user.getRoles().stream().map(Role::getName).toList()));
    }
}
