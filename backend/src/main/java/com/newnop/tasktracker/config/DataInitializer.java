package com.newnop.tasktracker.config;

import com.newnop.tasktracker.entity.Role;
import com.newnop.tasktracker.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final List<String> DEFAULT_ROLES = List.of("ROLE_USER", "ROLE_ADMIN");

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        DEFAULT_ROLES.forEach(this::createRoleIfMissing);
    }

    private void createRoleIfMissing(String name) {
        if (roleRepository.findByName(name).isEmpty()) {
            roleRepository.save(Role.builder().name(name).build());
        }
    }
}
