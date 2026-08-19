package com.medique.service;

import com.medique.dto.request.AvailabilityRequest;
import com.medique.dto.request.CreateDoctorRequest;
import com.medique.dto.request.DoctorRequest;
import com.medique.dto.response.DoctorAdminResponse;
import com.medique.dto.response.DoctorQueueResponse;
import com.medique.dto.response.DoctorResponse;
import com.medique.entity.Department;
import com.medique.entity.Doctor;
import com.medique.entity.QueueToken;
import com.medique.enums.QueueStatus;
import com.medique.exception.*;
import com.medique.mapper.DoctorMapper;
import com.medique.mapper.QueueTokenMapper;
import com.medique.repository.DepartmentRepository;
import com.medique.repository.DoctorRepository;
import com.medique.repository.QueueTokenRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final QueueTokenRepository queueTokenRepository;

    public DoctorService(
            DoctorRepository doctorRepository,
            DepartmentRepository departmentRepository,
            PasswordEncoder passwordEncoder,
            QueueTokenRepository queueTokenRepository) {

        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
        this.queueTokenRepository = queueTokenRepository;
    }

    private Department findDepartmentOrThrow(Long departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id : " + departmentId));
    }

    private Doctor findDoctorOrThrow(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id : " + doctorId));
    }


    private Doctor getAuthenticatedDoctor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        return doctorRepository.findByEmail(email)
                .orElseThrow(() ->
                        new DoctorNotFoundException(
                                "Authenticated doctor not found"
                        ));
    }

    public List<DoctorResponse> getDoctorsByDepartment(Long departmentId) {
        findDepartmentOrThrow(departmentId);
        return DoctorMapper.toResponse(doctorRepository.findActiveAndAvailableDoctorsByDepartment(departmentId));
    }

    public List<DoctorAdminResponse> getDoctors() {
        return DoctorMapper.toAdminResponse(doctorRepository.findAll());
    }


    public DoctorAdminResponse createDoctor(CreateDoctorRequest request) {
        Department department = findDepartmentOrThrow(request.getDepartmentId());

        if (doctorRepository.existsByDoctorCode(request.getDoctorCode()))
            throw new DoctorAlreadyExistsException("doctor already exists with Doctor Code " + request.getDoctorCode());
        if (doctorRepository.existsByEmail(request.getEmail()))
            throw new DoctorAlreadyExistsException("doctor already exists with Email " + request.getEmail());
        if (doctorRepository.existsByPhoneNumber(request.getPhoneNumber()))
            throw new DoctorAlreadyExistsException("doctor already exists with Phone Number " + request.getPhoneNumber());
        if (!department.isActive()) {
            throw new DepartmentInactiveException("Cannot assign a doctor to an inactive department.");
        }
        Doctor doctor = DoctorMapper.toEntity(request);
        doctor.setDepartment(department);
        doctor.setPassword(passwordEncoder.encode(request.getPassword()));

        return DoctorMapper.toAdminResponse(doctorRepository.save(doctor));
    }

    public DoctorAdminResponse getDoctorById(Long doctorId) {
        return DoctorMapper.toAdminResponse(findDoctorOrThrow(doctorId));
    }

    public DoctorAdminResponse updateDoctor(Long doctorId, DoctorRequest request) {
        Doctor doctor = findDoctorOrThrow(doctorId);
        Department department = findDepartmentOrThrow(request.getDepartmentId());

        if (!department.isActive())
            throw new DepartmentInactiveException("Cannot assign a doctor to an inactive department.");

        if (!doctor.getEmail().equals(request.getEmail()) && doctorRepository.existsByEmail(request.getEmail()))
            throw new DoctorAlreadyExistsException("doctor with email '" + request.getEmail() + "' already Exists");

        if (!doctor.getDoctorCode().equals(request.getDoctorCode()) && doctorRepository.existsByDoctorCode(request.getDoctorCode()))
            throw new DoctorAlreadyExistsException("doctor  with Doctor Code '" + request.getDoctorCode() + "' already Exists");

        if (!doctor.getPhoneNumber().equals(request.getPhoneNumber()) && doctorRepository.existsByPhoneNumber(request.getPhoneNumber()))
            throw new DoctorAlreadyExistsException("doctor with Phone Number '" + request.getPhoneNumber() + "' already exists ");

        doctor.setDoctorCode(request.getDoctorCode());
        doctor.setFullName(request.getFullName());
        doctor.setEmail(request.getEmail());
        doctor.setPhoneNumber(request.getPhoneNumber());
        doctor.setQualification(request.getQualification());
        doctor.setDepartment(department);

        return DoctorMapper.toAdminResponse(doctorRepository.save(doctor));
    }

    public DoctorAdminResponse deactivateDoctor(Long doctorId) {
        Doctor doctor = findDoctorOrThrow(doctorId);
        doctor.setActive(false);
        doctor.setAvailable(false);
        return DoctorMapper.toAdminResponse(doctorRepository.save(doctor));
    }

    public DoctorAdminResponse activateDoctor(Long doctorId) {
        Doctor doctor = findDoctorOrThrow(doctorId);
        doctor.setActive(true);
        return DoctorMapper.toAdminResponse(doctorRepository.save(doctor));
    }

    public List<DoctorQueueResponse> getDailyQueue() {

        Doctor doctor = getAuthenticatedDoctor();

        List<QueueToken> queueTokens =
                queueTokenRepository.getDoctorQueue(doctor.getDoctorId(), LocalDate.now()
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

    public DoctorQueueResponse callNextPatient() {

        Doctor doctor = getAuthenticatedDoctor();

        QueueToken currentToken = queueTokenRepository.findFirstByDoctorDoctorIdAndBookingDateAndStatus(
                doctor.getDoctorId(),
                LocalDate.now(),
                QueueStatus.IN_PROGRESS).orElse(null);

        if (currentToken != null)
            throw new QueueOperationException("Complete the current consultation before calling the next patient");


        QueueToken nextQueueToken = queueTokenRepository.findNextToken(doctor.getDoctorId(), LocalDate.now(), QueueStatus.WAITING)
                .orElseThrow(() -> new QueueTokenNotFoundException("No queue token not found with waiting status"));

        nextQueueToken.setStatus(QueueStatus.IN_PROGRESS);
        queueTokenRepository.save(nextQueueToken);
        return QueueTokenMapper.toDoctorQueueResponse(nextQueueToken, 1);

    }

    public DoctorQueueResponse completeConsultation() {
        Doctor doctor = getAuthenticatedDoctor();

        QueueToken queueToken = queueTokenRepository.findFirstByDoctorDoctorIdAndBookingDateAndStatus(
                doctor.getDoctorId(),
                LocalDate.now(),
                QueueStatus.IN_PROGRESS).orElseThrow(
                () -> new QueueOperationException("There is no current consultation to mark completed"));

        queueToken.setStatus(QueueStatus.COMPLETED);
        queueTokenRepository.save(queueToken);
        return QueueTokenMapper.toDoctorQueueResponse(queueToken, 0);
    }

    public DoctorAdminResponse updateAvailability(boolean available) {

        Doctor doctor = getAuthenticatedDoctor();

        if (!doctor.isActive()) {
            throw new DoctorNotFoundException(
                    "Doctor is not active"
            );
        }

        doctor.setAvailable(available);

        return DoctorMapper.toAdminResponse(
                doctorRepository.save(doctor)
        );


    }
}
