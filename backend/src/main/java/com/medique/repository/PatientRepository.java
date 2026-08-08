package com.medique.repository;

import com.medique.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    @Query("""
            SELECT p FROM Patient p
            WHERE p.fullName = :fullName
            AND p.dateOfBirth = :dateOfBirth
            AND p.phoneNumber = :phoneNumber
            """)
    Optional<Patient> findUniquePatient(
            @Param("fullName") String fullName,
            @Param("dateOfBirth")LocalDate dateOfBirth,
            @Param("phoneNumber")String phoneNumber
    );
}
