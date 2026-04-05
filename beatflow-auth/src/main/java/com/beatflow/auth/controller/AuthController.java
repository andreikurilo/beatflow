package com.beatflow.auth.controller;

import com.beatflow.auth.dto.AuthResponse;
import com.beatflow.auth.dto.LoginRequest;
import com.beatflow.auth.dto.RegisterRequest;
import com.beatflow.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final String REFRESH_TOKEN_COOKIE = "refreshToken";
    private static final int REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

    private final AuthService authService;

    @Value("${app.cookies.secure:false}")
    private boolean secureCookies;

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse auth = authService.login(request);

        addCookie(response, auth.getRefreshToken(), REFRESH_TOKEN_MAX_AGE_SECONDS);

        return new AuthResponse(auth.getAccessToken(), null);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@CookieValue(value = REFRESH_TOKEN_COOKIE, required = false) String refreshToken,
                       HttpServletResponse response) {
        authService.logout(refreshToken);

        addCookie(response, "", 0);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@CookieValue(value = REFRESH_TOKEN_COOKIE, required = false) String refreshToken) {
        return authService.refresh(refreshToken);
    }

    private void addCookie(HttpServletResponse response, String value, int maxAge) {
        Cookie cookie = new Cookie(AuthController.REFRESH_TOKEN_COOKIE, value);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(maxAge);
        cookie.setSecure(secureCookies);
        response.addCookie(cookie);
    }
}
