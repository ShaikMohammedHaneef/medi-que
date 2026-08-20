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

    @Query("""
        SELECT COUNT(q) > 0
        FROM QueueToken q
        WHERE q.patient.patientId = :patientId
          AND q.bookingDate = :bookingDate
          AND q.status IN :statuses
        """)
    boolean existsActiveTokenForToday(
            @Param("patientId") Long patientId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("statuses") List<QueueStatus> statuses
    );

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
    int countOfActiveQueueTokens(@Param("doctorId") Long doctor_id,
                                 @Param("bookingDate") LocalDate bookingDate,
                                 @Param("statuses") List<QueueStatus> statuses,
                                 @Param("queueTokenId") Long queuTokenId);

    @Query("""
            SELECT q
            FROM QueueToken q 
            WHERE q.doctor.doctorId = :doctorId
            AND q.bookingDate = :bookingDate
            ORDER BY q.queueTokenId ASC
            """)
    List<QueueToken> getDoctorQueue(@Param("doctorId") Long doctor_id, @Param("bookingDate") LocalDate bookingDate);

    @Query(""" 
            SELECT q 
            FROM QueueToken q
            WHERE q.doctor.doctorId = :doctorId
            AND q.bookingDate = :bookingDate
            AND q.status = :status
            ORDER BY q.queueTokenId ASC
            LIMIT 1
            """)
    Optional<QueueToken> findNextToken(
            @Param("doctorId") Long doctorId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("status") QueueStatus status
    );

    Optional<QueueToken> findFirstByDoctorDoctorIdAndBookingDateAndStatus(
            Long doctorId,
            LocalDate bookingDate,
            QueueStatus status
    );

    @Query("""
        SELECT q
        FROM QueueToken q
        WHERE q.doctor.doctorCode = :doctorCode
          AND q.bookingDate = :bookingDate
        ORDER BY q.queueTokenId ASC
        """)
    List<QueueToken> getReceptionistQueue(
            @Param("doctorCode") String doctorCode,
            @Param("bookingDate") LocalDate bookingDate
    );

    long countByBookingDate(LocalDate bookingDate);

    @Query("""
        SELECT q.status, COUNT(q)
        FROM QueueToken q
        WHERE q.bookingDate = :bookingDate
        GROUP BY q.status
        """)
    List<Object[]> countTodayAppointmentsByStatus(
            @Param("bookingDate") LocalDate bookingDate
    );
}
