package com.beatflow.auth.controller;

import com.beatflow.auth.dto.AuthResponse;
import com.beatflow.auth.dto.LoginRequest;
import com.beatflow.auth.dto.RegisterRequest;
import com.beatflow.auth.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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

        Cookie cookie = new Cookie("refreshToken", auth.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        cookie.setSecure(false); // dev

        response.addCookie(cookie);

        return new AuthResponse(auth.getAccessToken(), null);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@CookieValue(value = "refreshToken", required = false) String refreshToken,
                       HttpServletResponse response) {
        authService.logout(refreshToken);

        Cookie cookie = new Cookie("refreshToken", "");
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setSecure(false);

        response.addCookie(cookie);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        return authService.refresh(refreshToken);
    }
}
