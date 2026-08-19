package com.medique.service;

import com.medique.dto.request.CreateReceptionistRequest;
import com.medique.dto.request.ReceptionistRequest;
import com.medique.dto.response.DoctorQueueResponse;
import com.medique.dto.response.ReceptionistResponse;
import com.medique.entity.QueueToken;
import com.medique.entity.Receptionist;
import com.medique.enums.QueueStatus;
import com.medique.exception.ReceptionistAlreadyExistsException;
import com.medique.exception.ReceptionistNotFoundException;
import com.medique.mapper.QueueTokenMapper;
import com.medique.mapper.ReceptionistMapper;
import com.medique.repository.QueueTokenRepository;
import com.medique.repository.ReceptionistRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReceptionistService {

    private final ReceptionistRepository receptionistRepository;
    private final PasswordEncoder passwordEncoder;
    private final QueueTokenRepository queueTokenRepository;

    public ReceptionistService(ReceptionistRepository receptionistRepository,
                               PasswordEncoder passwordEncoder,
                               QueueTokenRepository queueTokenRepository) {
        this.receptionistRepository = receptionistRepository;
        this.passwordEncoder = passwordEncoder;
        this.queueTokenRepository = queueTokenRepository;
    }


    private Receptionist findReceptionistOrThrow(Long receptionistId) {
        return receptionistRepository.findById(receptionistId)
                .orElseThrow(() -> new ReceptionistNotFoundException( "Receptionist not found with id: " + receptionistId));
    }

    public List<ReceptionistResponse> getReceptionists() {
        return ReceptionistMapper.toResponse(receptionistRepository.findAll());
    }

    public ReceptionistResponse getReceptionistById(Long receptionistId) {
        return ReceptionistMapper.toResponse(findReceptionistOrThrow(receptionistId));
    }

    public ReceptionistResponse createReceptionist(CreateReceptionistRequest request) {
        if (receptionistRepository.existsByEmail(request.getEmail())) {
            throw new ReceptionistAlreadyExistsException(
                    "Receptionist already exists with email '" + request.getEmail() + "'");
        }

        if (receptionistRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new ReceptionistAlreadyExistsException(
                    "Receptionist already exists with phone number '" + request.getPhoneNumber() + "'");
        }
        Receptionist receptionist = ReceptionistMapper.toEntity(request);
        receptionist.setPassword(passwordEncoder.encode(request.getPassword()));
        return ReceptionistMapper.toResponse(receptionistRepository.save(receptionist));
    }

    public ReceptionistResponse updateReceptionist(Long receptionistId, ReceptionistRequest request) {
        Receptionist receptionist = findReceptionistOrThrow(receptionistId);

        if (!receptionist.getEmail().equals(request.getEmail()) && receptionistRepository.existsByEmail(request.getEmail())) {
            throw new ReceptionistAlreadyExistsException(
                    "Receptionist already exists with email '" + request.getEmail() + "'");
        }

        if (!receptionist.getPhoneNumber().equals(request.getPhoneNumber()) && receptionistRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new ReceptionistAlreadyExistsException(
                    "Receptionist already exists with phone number '" + request.getPhoneNumber() + "'");
        }

        receptionist.setFullName(request.getFullName());
        receptionist.setEmail(request.getEmail());
        receptionist.setPhoneNumber(request.getPhoneNumber());

        return ReceptionistMapper.toResponse(receptionistRepository.save(receptionist));
    }

    public ReceptionistResponse activateReceptionist(Long receptionistId) {
        Receptionist receptionist = findReceptionistOrThrow(receptionistId);

        receptionist.setActive(true);
        return ReceptionistMapper.toResponse(receptionistRepository.save(receptionist));
    }

    public ReceptionistResponse deactivateReceptionist(Long receptionistId) {
        Receptionist receptionist = findReceptionistOrThrow(receptionistId);

        receptionist.setActive(false);
        return ReceptionistMapper.toResponse(receptionistRepository.save(receptionist));
    }

    public List<DoctorQueueResponse> getDoctorQueue(String doctorCode) {

        List<QueueToken> queueTokens =
                queueTokenRepository.getReceptionistQueue(
                        doctorCode,
                        LocalDate.now()
                );

        int queuePosition = 0;

        List<DoctorQueueResponse> response = new ArrayList<>();

        for (QueueToken queueToken : queueTokens) {
            if (queueToken.getStatus() == QueueStatus.WAITING || queueToken.getStatus() == QueueStatus.IN_PROGRESS) {

                queuePosition++;

                response.add(QueueTokenMapper.toDoctorQueueResponse(queueToken, queuePosition));

            } else
                response.add(QueueTokenMapper.toDoctorQueueResponse(queueToken, 0));
        }

        return response;
    }
}
