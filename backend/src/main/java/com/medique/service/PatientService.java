package com.medique.service;

import com.medique.dto.request.PatientRequest;
import com.medique.dto.request.TokenBookingRequest;
import com.medique.dto.response.PatientResponse;
import com.medique.dto.response.TokenBookingResponse;
import com.medique.entity.Doctor;
import com.medique.entity.Patient;
import com.medique.entity.QueueToken;
import com.medique.enums.QueueStatus;
import com.medique.exception.ActiveBookingExistsException;
import com.medique.exception.DoctorNotFoundException;
import com.medique.exception.PatientAlreadyExistsException;
import com.medique.exception.PatientNotFoundException;
import com.medique.mapper.PatientMapper;
import com.medique.repository.DoctorRepository;
import com.medique.repository.PatientRepository;
import com.medique.repository.QueueTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final QueueTokenRepository queueTokenRepository;

    public PatientService(PatientRepository patientRepository,
                          DoctorRepository doctorRepository,
                          QueueTokenRepository queueTokenRepository) {

        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.queueTokenRepository = queueTokenRepository;
    }

    private Patient findPatientOrThrow(Long patientId) {
        return patientRepository.findById(patientId)
                .orElseThrow(() -> new PatientNotFoundException("Patient not found with id :" + patientId));
    }

    public PatientResponse getPatientById(Long patientId) {
        return PatientMapper.toResponse(findPatientOrThrow(patientId));
    }

    public PatientResponse updatePatient(PatientRequest request, Long patientId) {
        Patient patient = findPatientOrThrow(patientId);

        Patient existingPatient = patientRepository.findUniquePatient(
                        request.getFullName(),
                        request.getDateOfBirth(),
                        request.getPhoneNumber())
                .orElse(null);

        if (existingPatient != null && !existingPatient.getPatientId().equals(patientId)) {

            throw new PatientAlreadyExistsException("A patient with the same name, date of birth and phone number already exists");
        }


        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setFullName(request.getFullName());
        patient.setPhoneNumber(request.getPhoneNumber());

        return PatientMapper.toResponse(patientRepository.save(patient));
    }

    public TokenBookingResponse bookOP(TokenBookingRequest request) {
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id : " + request.getDoctorId()));

        Patient patient = patientRepository.findUniquePatient(request.getFullName(),
                request.getDateOfBirth(),
                request.getPhoneNumber()).orElseGet(() -> {
            Patient newPatient = Patient.builder()
                    .fullName(request.getFullName())
                    .dateOfBirth(request.getDateOfBirth())
                    .gender(request.getGender())
                    .phoneNumber(request.getPhoneNumber())
                    .build();
            return patientRepository.save(newPatient);
        });

        boolean hasActiveToken = queueTokenRepository.existsByPatientPatientIdAndQueueStatusIn(
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
                .queueStatus(QueueStatus.WAITING)
                .bookingDate(LocalDate.now())
                .build();

        QueueToken savedQueueToken = queueTokenRepository.save(queueToken);


        return TokenBookingResponse.builder()
                .patientId(patient.getPatientId())
                .doctorId(doctor.getDoctorId())
                .tokenNumber(savedQueueToken.getTokenNumber())
                .doctorName(doctor.getFullName())
                .status(savedQueueToken.getQueueStatus().name())
                .bookingDate(savedQueueToken.getBookingDate())
                .build();
    }
}
