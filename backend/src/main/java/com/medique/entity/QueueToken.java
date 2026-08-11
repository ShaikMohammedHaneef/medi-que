package com.medique.entity;

import com.medique.enums.QueueStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "queue_token",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_queue_token",
                        columnNames = {"booking_date", "token_number"}
                )
        }
)
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QueueToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "queue_token_id")
    private Long queueTokenId;

    @Column(name = "token_number", nullable = false, length = 10)
    private String tokenNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Enumerated(EnumType.STRING)
    @Column(name = "queue_status", nullable = false)
    private QueueStatus queueStatus;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "booked_at", nullable = false)
    private LocalTime bookedAt = LocalTime.now();
}
