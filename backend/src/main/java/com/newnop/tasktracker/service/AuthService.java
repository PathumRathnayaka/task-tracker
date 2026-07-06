package com.newnop.tasktracker.service;

import com.newnop.tasktracker.dto.request.LoginRequest;
import com.newnop.tasktracker.dto.request.RegisterRequest;
import com.newnop.tasktracker.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}
