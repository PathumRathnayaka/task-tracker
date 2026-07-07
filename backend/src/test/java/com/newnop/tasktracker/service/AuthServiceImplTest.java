package com.newnop.tasktracker.service;

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
import com.newnop.tasktracker.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private CustomUserDetailsService userDetailsService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setUsername("alice");
        registerRequest.setEmail("alice@example.com");
        registerRequest.setPassword("secret123");
    }

    @Test
    void registerCreatesUserAndReturnsToken() {
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(roleRepository.findByName("ROLE_USER"))
                .thenReturn(Optional.of(Role.builder().id(1L).name("ROLE_USER").build()));
        when(passwordEncoder.encode("secret123")).thenReturn("hashed");
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("alice")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.register(registerRequest);

        assertEquals("jwt-token", response.getAccessToken());
        assertEquals("alice", response.getUsername());
        assertEquals("alice@example.com", response.getEmail());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerFailsWhenUsernameTaken() {
        when(userRepository.existsByUsername("alice")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    void loginReturnsToken() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("alice");
        loginRequest.setPassword("secret123");
        User user = User.builder()
                .id(1L).username("alice").email("alice@example.com").password("hashed").build();
        when(userRepository.findByUsername("alice")).thenReturn(Optional.of(user));
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserByUsername("alice")).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.login(loginRequest);

        assertEquals("jwt-token", response.getAccessToken());
        assertEquals("alice", response.getUsername());
        verify(authenticationManager).authenticate(any());
    }
}
