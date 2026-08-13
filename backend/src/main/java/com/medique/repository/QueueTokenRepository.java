package com.medique.repository;

import com.medique.entity.QueueToken;
import com.medique.enums.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface QueueTokenRepository extends JpaRepository<QueueToken, Long> {

    boolean existsByPatientPatientIdAndStatusIn(Long patientId, Collection<QueueStatus> statuses);

    Optional<QueueToken> findTopByDoctorDoctorIdAndBookingDateOrderByQueueTokenIdDesc(
            Long doctorId,
            LocalDate bookingDate
    );

    Optional<QueueToken> findByTokenNumberAndBookingDate(String tokenNumber, LocalDate bookingDate);

    @Query("""
            SELECT COUNT(q)
            FROM QueueToken q 
            WHERE q.doctor.doctorId = :doctorId
            AND q.bookingDate = :bookingDate
            AND q.status IN :statuses
            AND q.queueTokenId < :queueTokenId""")
    int countOfActiveQueueTokens( @Param("doctorId") Long doctor_id,
                                 @Param("bookingDate") LocalDate bookingDate,
                                 @Param("statuses") List<QueueStatus> statuses,
                                  @Param("queueTokenId") Long queuTOkenId);
}
