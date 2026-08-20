package com.medique.service;

import com.medique.dto.response.QueueTrackingResponse;
import com.medique.entity.Doctor;
import com.medique.entity.Patient;
import com.medique.entity.QueueToken;
import com.medique.enums.QueueStatus;
import com.medique.exception.ActiveBookingExistsException;
import com.medique.exception.QueueOperationException;
import com.medique.exception.QueueTokenNotFoundException;
import com.medique.mapper.QueueTokenMapper;
import com.medique.repository.QueueTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class QueueTokenService {

    private final QueueTokenRepository queueTokenRepository;
    private final QueueWebSocketService queueWebSocketService;

    public QueueTokenService(QueueTokenRepository queueTokenRepository, QueueWebSocketService queueWebSocketService) {
        this.queueTokenRepository = queueTokenRepository;
        this.queueWebSocketService = queueWebSocketService;
    }

    private QueueToken findQueueTokenOrThrow(String  tokenNumber){
        return queueTokenRepository.findByTokenNumberAndBookingDate(tokenNumber, LocalDate.now())
                .orElseThrow(()-> new QueueTokenNotFoundException("there is no active queue token with token number : "+ tokenNumber));
    }

    public QueueToken createQueueToken(Patient patient, Doctor doctor) {

        boolean hasActiveToken = queueTokenRepository.existsActiveTokenForToday(
                patient.getPatientId(),
                LocalDate.now(),
                List.of(QueueStatus.WAITING, QueueStatus.IN_PROGRESS));

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

        QueueToken savedQueueToken = queueTokenRepository.save(queueToken);

        QueueTrackingResponse queueTrackingResponse = trackQueue(savedQueueToken.getTokenNumber());

        queueWebSocketService.publishQueueUpdate(savedQueueToken.getDoctor().getDoctorCode(), queueTrackingResponse);

        return savedQueueToken;
    }

    public QueueTrackingResponse trackQueue(String tokenNumber) {

        QueueToken queueToken = findQueueTokenOrThrow(tokenNumber);

        int avgConsultationTime = 6;

        int patientsAhead = 0;
        int queuePosition = 0;
        int waitTime = 0;

        if (queueToken.getStatus() == QueueStatus.IN_PROGRESS || queueToken.getStatus() == QueueStatus.WAITING) {

            patientsAhead = queueTokenRepository.countOfActiveQueueTokens(
                    queueToken.getDoctor().getDoctorId(),
                    LocalDate.now(),
                    List.of(QueueStatus.IN_PROGRESS, QueueStatus.WAITING),
                    queueToken.getQueueTokenId()
            );

            queuePosition = patientsAhead + 1;
            waitTime = avgConsultationTime * (patientsAhead);
        }

        return QueueTokenMapper.toTrackingResponse(queueToken,
                queuePosition,
                patientsAhead,
                waitTime);

    }

    public QueueTrackingResponse cancelQueueToken(String tokenNumber) {

        QueueToken queueToken = findQueueTokenOrThrow(tokenNumber);

        if(queueToken.getStatus() != QueueStatus.WAITING )
            throw new QueueOperationException("Queue token cannot be cancelled with status code " +queueToken.getStatus());

        queueToken.setStatus(QueueStatus.CANCELLED);
        queueTokenRepository.save(queueToken);

        return QueueTokenMapper.toTrackingResponse(queueToken, 0, 0, 0);
    }
}
