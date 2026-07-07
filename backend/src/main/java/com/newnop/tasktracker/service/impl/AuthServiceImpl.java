package com.newnop.tasktracker.service.impl;

import com.newnop.tasktracker.dto.request.LoginRequest;
import com.newnop.tasktracker.dto.request.RegisterRequest;
import com.newnop.tasktracker.dto.response.AuthResponse;
import com.newnop.tasktracker.entity.Role;
import com.newnop.tasktracker.entity.User;
import com.newnop.tasktracker.exception.BadRequestException;
import com.newnop.tasktracker.repository.RoleRepository;
import com.newnop.tasktracker.repository.UserRepository;
import com.newnop.tasktracker.security.CustomUserDetailsService;
import com.newnop.tasktracker.security.JwtService;
import com.newnop.tasktracker.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use: " + request.getEmail());
        }

        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new IllegalStateException("Default role ROLE_USER is not configured"));

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(userRole))
                .enabled(true)
                .build();

        userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        return buildAuthResponse(user, jwtService.generateToken(userDetails));
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        return buildAuthResponse(user, jwtService.generateToken(userDetails));
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        Set<String> roles = user.getRoles() == null ? Set.of()
                : user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .build();
    }
}
