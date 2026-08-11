package com.medique.service;

import com.medique.entity.Doctor;
import com.medique.entity.Patient;
import com.medique.entity.QueueToken;
import com.medique.enums.QueueStatus;
import com.medique.exception.ActiveBookingExistsException;
import com.medique.repository.QueueTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class QueueTokenService {

    private final QueueTokenRepository queueTokenRepository;

    public QueueTokenService(QueueTokenRepository queueTokenRepository){
        this.queueTokenRepository = queueTokenRepository;
    }

    public QueueToken createQueueToken(Patient patient, Doctor doctor){

        boolean hasActiveToken = queueTokenRepository.existsByPatientPatientIdAndStatusIn(
                patient.getPatientId(),
                List.of(QueueStatus.WAITING,
                        QueueStatus.IN_PROGRESS));

        if (hasActiveToken) {
            throw new ActiveBookingExistsException("Patient already has an active booking");
        }

        QueueToken latestToken = queueTokenRepository.findTopByDoctorDoctorIdAndBookingDateOrderByQueueTokenIdDesc(
                        doctor.getDoctorId(),
                        LocalDate.now())
                .orElse(null);


        String token;

        if (latestToken == null) {
            token = doctor.getDoctorCode() + "-" + "001";
        } else {
            String lastTokenNumber = latestToken.getTokenNumber();

            int nextSequence = Integer.parseInt(lastTokenNumber.substring(lastTokenNumber.indexOf("-") + 1)) + 1;

            token = doctor.getDoctorCode() + "-" + String.format("%03d", nextSequence);
        }

        QueueToken queueToken = QueueToken.builder()
                .tokenNumber(token)
                .patient(patient)
                .doctor(doctor)
                .status(QueueStatus.WAITING)
                .bookingDate(LocalDate.now())
                .build();

        return queueTokenRepository.save(queueToken);
    }
}
