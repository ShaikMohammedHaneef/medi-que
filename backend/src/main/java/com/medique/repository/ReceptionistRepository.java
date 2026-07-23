package com.medique.repository;

import com.medique.entity.Receptionist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReceptionistRepository extends JpaRepository<Receptionist, Long> {
    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    Optional<Receptionist> findByEmail(String email);
}
