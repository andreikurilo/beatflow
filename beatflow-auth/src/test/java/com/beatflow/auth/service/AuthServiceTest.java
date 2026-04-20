package com.beatflow.auth.service;

import com.beatflow.auth.domain.RefreshToken;
import com.beatflow.auth.domain.Role;
import com.beatflow.auth.domain.User;
import com.beatflow.auth.dto.AuthResponse;
import com.beatflow.auth.dto.LoginRequest;
import com.beatflow.auth.dto.RegisterRequest;
import com.beatflow.auth.repository.RefreshTokenRepository;
import com.beatflow.auth.repository.RoleRepository;
import com.beatflow.auth.repository.UserRepository;
import com.beatflow.auth.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_shouldSaveUser() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("demo@beatflow.org");
        request.setPassword("secret123");

        Role role = new Role();
        role.setId(1);
        role.setName("USER");

        when(userRepository.existsByEmail("demo@beatflow.org")).thenReturn(false);
        when(roleRepository.findByName("USER")).thenReturn(Optional.of(role));
        when(passwordEncoder.encode("secret123")).thenReturn("encoded-password");

        authService.register(request);

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());

        User saved = captor.getValue();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getEmail()).isEqualTo("demo@beatflow.org");
        assertThat(saved.getPasswordHash()).isEqualTo("encoded-password");
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getRoles()).isEqualTo(Set.of(role));
    }

    @Test
    void register_shouldThrow_whenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("demo@beatflow.org");
        request.setPassword("secret123");

        when(userRepository.existsByEmail("demo@beatflow.org")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request)).isInstanceOf(RuntimeException.class)
                                                               .hasMessage("Email already exists");

        verify(roleRepository, never()).findByName(any());
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_shouldThrow_whenUserRoleMissing() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("demo@beatflow.org");
        request.setPassword("secret123");

        when(userRepository.existsByEmail("demo@beatflow.org")).thenReturn(false);
        when(roleRepository.findByName("USER")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.register(request)).isInstanceOf(RuntimeException.class)
                                                               .hasMessage("Role USER not found");

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_shouldReturnTokens_whenCredentialsAreValid() {
        LoginRequest request = new LoginRequest();
        request.setEmail("demo@beatflow.org");
        request.setPassword("secret123");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("demo@beatflow.org");
        user.setPasswordHash("encoded-password");

        when(userRepository.findByEmail("demo@beatflow.org")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", "encoded-password")).thenReturn(true);
        when(jwtService.generateToken(user)).thenReturn("access-token");

        AuthResponse response = authService.login(request);

        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getRefreshToken()).isNotBlank();

        ArgumentCaptor<RefreshToken> captor = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(captor.capture());

        RefreshToken saved = captor.getValue();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getUserId()).isEqualTo(user.getId());
        assertThat(saved.getTokenHash()).isNotBlank();
        assertThat(saved.isRevoked()).isFalse();
        assertThat(saved.getExpiresAt()).isAfter(LocalDateTime.now().plusDays(6));
    }

    @Test
    void login_shouldThrow_whenUserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setEmail("demo@beatflow.org");
        request.setPassword("secret123");

        when(userRepository.findByEmail("demo@beatflow.org")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request)).isInstanceOf(RuntimeException.class)
                                                            .hasMessage("Invalid credentials");

        verify(refreshTokenRepository, never()).save(any());
    }

    @Test
    void login_shouldThrow_whenPasswordDoesNotMatch() {
        LoginRequest request = new LoginRequest();
        request.setEmail("demo@beatflow.org");
        request.setPassword("wrong-password");

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("demo@beatflow.org");
        user.setPasswordHash("encoded-password");

        when(userRepository.findByEmail("demo@beatflow.org")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "encoded-password")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request)).isInstanceOf(RuntimeException.class)
                                                            .hasMessage("Invalid credentials");

        verify(refreshTokenRepository, never()).save(any());
    }

    @Test
    void refresh_shouldReturnNewAccessToken_whenRefreshTokenIsValid() throws Exception {
        String rawRefreshToken = "refresh-token-value";
        String tokenHash = invokeHash(rawRefreshToken);
        UUID userId = UUID.randomUUID();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setId(UUID.randomUUID());
        refreshToken.setUserId(userId);
        refreshToken.setTokenHash(tokenHash);
        refreshToken.setRevoked(false);
        refreshToken.setExpiresAt(LocalDateTime.now().plusDays(1));

        User user = new User();
        user.setId(userId);
        user.setEmail("demo@beatflow.org");

        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(refreshToken));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("new-access-token");

        AuthResponse response = authService.refresh(rawRefreshToken);

        assertThat(response.getAccessToken()).isEqualTo("new-access-token");
        assertThat(response.getRefreshToken()).isNull();
    }

    @Test
    void refresh_shouldThrow_whenTokenMissing() {
        assertThatThrownBy(() -> authService.refresh(" ")).isInstanceOf(RuntimeException.class)
                                                          .hasMessage("Missing refresh token");
    }

    @Test
    void refresh_shouldThrow_whenTokenNotFound() throws Exception {
        String rawRefreshToken = "refresh-token-value";
        String tokenHash = invokeHash(rawRefreshToken);

        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.refresh(rawRefreshToken)).isInstanceOf(RuntimeException.class)
                                                                      .hasMessage("Invalid refresh token");
    }

    @Test
    void refresh_shouldThrow_whenTokenRevoked() throws Exception {
        String rawRefreshToken = "refresh-token-value";
        String tokenHash = invokeHash(rawRefreshToken);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setTokenHash(tokenHash);
        refreshToken.setRevoked(true);
        refreshToken.setExpiresAt(LocalDateTime.now().plusDays(1));

        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(refreshToken));

        assertThatThrownBy(() -> authService.refresh(rawRefreshToken)).isInstanceOf(RuntimeException.class)
                                                                      .hasMessage("Refresh token revoked");
    }

    @Test
    void refresh_shouldThrow_whenTokenExpired() throws Exception {
        String rawRefreshToken = "refresh-token-value";
        String tokenHash = invokeHash(rawRefreshToken);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setTokenHash(tokenHash);
        refreshToken.setRevoked(false);
        refreshToken.setExpiresAt(LocalDateTime.now().minusSeconds(1));

        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(refreshToken));

        assertThatThrownBy(() -> authService.refresh(rawRefreshToken)).isInstanceOf(RuntimeException.class)
                                                                      .hasMessage("Refresh token expired");
    }

    @Test
    void refresh_shouldThrow_whenUserNotFound() throws Exception {
        String rawRefreshToken = "refresh-token-value";
        String tokenHash = invokeHash(rawRefreshToken);
        UUID userId = UUID.randomUUID();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setTokenHash(tokenHash);
        refreshToken.setUserId(userId);
        refreshToken.setRevoked(false);
        refreshToken.setExpiresAt(LocalDateTime.now().plusDays(1));

        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(refreshToken));
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.refresh(rawRefreshToken)).isInstanceOf(RuntimeException.class)
                                                                      .hasMessage("User not found");
    }

    @Test
    void logout_shouldDoNothing_whenTokenMissing() {
        authService.logout(null);
        authService.logout("");
        authService.logout("   ");

        verifyNoInteractions(refreshTokenRepository);
    }

    @Test
    void logout_shouldRevokeToken_whenFound() throws Exception {
        String rawRefreshToken = "refresh-token-value";
        String tokenHash = invokeHash(rawRefreshToken);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setId(UUID.randomUUID());
        refreshToken.setUserId(UUID.randomUUID());
        refreshToken.setTokenHash(tokenHash);
        refreshToken.setRevoked(false);

        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(refreshToken));

        authService.logout(rawRefreshToken);

        assertThat(refreshToken.isRevoked()).isTrue();
        verify(refreshTokenRepository).save(refreshToken);
    }

    @Test
    void logout_shouldDoNothing_whenTokenNotFound() throws Exception {
        String rawRefreshToken = "refresh-token-value";
        String tokenHash = invokeHash(rawRefreshToken);

        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.empty());

        authService.logout(rawRefreshToken);

        verify(refreshTokenRepository, never()).save(any());
    }

    private String invokeHash(String token) throws Exception {
        Method method = AuthService.class.getDeclaredMethod("hash", String.class);
        method.setAccessible(true);
        return (String) method.invoke(authService, token);
    }
}
