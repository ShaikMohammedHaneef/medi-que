package com.medique.repository;

import com.medique.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    @Query("""
            SELECT d FROM Doctor d
              WHERE d.department.departmentId = :departmentId
                AND d.isActive = true
                AND d.isAvailable = true
            ORDER BY d.fullName ASC
            """)
    List<Doctor> findActiveAndAvailableDoctorsByDepartment(@Param("departmentId") Long departmentId);

    @Query("""
            SELECT d FROM Doctor d
              WHERE d.doctorId = :doctorId
                AND d.isActive = true
                AND d.isAvailable = true
            """)
    Optional<Doctor> findActiveAndAvailableDoctorById(@Param("doctorId") Long doctorId);

    boolean existsByDoctorCode(String doctorCode);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    Optional<Doctor> findByEmail(String email);

    long countByIsActiveTrue();

}
