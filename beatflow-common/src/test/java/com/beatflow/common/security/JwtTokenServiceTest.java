package com.beatflow.common.security;

import com.beatflow.common.config.JwtProperties;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenServiceTest {

    private JwtTokenService jwtTokenService;

    @BeforeEach
    void setUp() {
        JwtProperties jwtProperties = new JwtProperties();
        jwtProperties.setSecret("super-secret-key-super-secret-key-123456");
        jwtProperties.setAccessTokenExpirationMs(60_000);

        jwtTokenService = new JwtTokenService(jwtProperties);
    }

    @Test
    void generateToken_andParseClaims_shouldWork() {
        String token = jwtTokenService.generateToken("user-123", Map.of("roles", List.of("USER", "ADMIN")));

        Claims claims = jwtTokenService.parseClaims(token);

        @SuppressWarnings("unchecked") List<String> roles = (List<String>) claims.get("roles", List.class);

        assertThat(claims.getSubject()).isEqualTo("user-123");
        assertThat(roles).containsExactly("USER", "ADMIN");
        assertThat(claims.getIssuedAt()).isNotNull();
        assertThat(claims.getExpiration()).isNotNull();
    }

    @Test
    void isValid_shouldReturnTrue_forValidToken() {
        String token = jwtTokenService.generateToken("user-123", Map.of("roles", List.of("USER")));

        assertThat(jwtTokenService.isValid(token)).isTrue();
    }

    @Test
    void isValid_shouldReturnFalse_forInvalidToken() {
        assertThat(jwtTokenService.isValid("not-a-real-token")).isFalse();
    }

    @Test
    void isValid_shouldReturnFalse_forExpiredToken() {
        JwtProperties jwtProperties = new JwtProperties();
        jwtProperties.setSecret("super-secret-key-super-secret-key-123456");
        jwtProperties.setAccessTokenExpirationMs(-1000);

        JwtTokenService expiredTokenService = new JwtTokenService(jwtProperties);

        String token = expiredTokenService.generateToken("user-123", Map.of("roles", List.of("USER")));

        assertThat(expiredTokenService.isValid(token)).isFalse();
    }

    @Test
    void extractSubject_shouldReturnSubject() {
        String token = jwtTokenService.generateToken("user-456", Map.of("roles", List.of("USER")));

        String subject = jwtTokenService.extractSubject(token);

        assertThat(subject).isEqualTo("user-456");
    }
}
