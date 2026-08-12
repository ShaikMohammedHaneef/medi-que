package com.medique.repository;

import com.medique.entity.QueueToken;
import com.medique.enums.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Optional;

public interface QueueTokenRepository extends JpaRepository<QueueToken, Long> {

    boolean existsByPatientPatientIdAndStatusIn(Long patientId, Collection<QueueStatus> statuses);

    Optional<QueueToken> findTopByDoctorDoctorIdAndBookingDateOrderByQueueTokenIdDesc(
            Long doctorId,
            LocalDate bookingDate
    );

    Optional<QueueToken> findByTokenNumber(String tokenNumber);
}
