package com.medique.config;

import com.medique.entity.Administrator;
import com.medique.repository.AdministratorRepository;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final AdministratorRepository administratorRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(AdministratorRepository administratorRepository, PasswordEncoder passwordEncoder) {
        this.administratorRepository = administratorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Value("${admin.full-name}")
    private String fullName;

    @Value("${admin.email}")
    private String email;

    @Value("${admin.password}")
    private String password;

    @Value("${admin.phone-number}")
    private String phoneNumber;


    @Override
    public void run(String... args) {
        if(administratorRepository.count() == 0) {
            Administrator administrator = Administrator.builder()
                    .fullName(fullName)
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .phoneNumber(phoneNumber)
                    .build();
            administratorRepository.save(administrator);
            logger.info("Default administrator account created successfully.");
        }
    }
}
