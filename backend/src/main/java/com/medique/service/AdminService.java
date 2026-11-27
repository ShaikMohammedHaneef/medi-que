package com.medique.service;

import com.medique.dto.request.UpdateStaffProfileRequest;
import com.medique.dto.response.AdminDashboardResponse;
import com.medique.dto.response.StaffProfileResponse;
import com.medique.entity.Administrator;
import com.medique.entity.QueueToken;
import com.medique.enums.QueueStatus;
import com.medique.repository.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AdminService {

    private final QueueTokenRepository queueTokenRepository;
    private final DoctorRepository doctorRepository;
    private final ReceptionistRepository receptionistRepository;
    private final DepartmentRepository departmentRepository;
    private final AdministratorRepository administratorRepository;

    public AdminService(
            QueueTokenRepository queueTokenRepository,
            DoctorRepository doctorRepository,
            ReceptionistRepository receptionistRepository,
            DepartmentRepository departmentRepository,
            AdministratorRepository administratorRepository) {

        this.queueTokenRepository = queueTokenRepository;
        this.doctorRepository = doctorRepository;
        this.receptionistRepository = receptionistRepository;
        this.departmentRepository = departmentRepository;
        this.administratorRepository = administratorRepository;
    }

    private Administrator getAuthenticatedAdmin() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return administratorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
    }

    public AdminDashboardResponse getDashboard() {

        LocalDate today = LocalDate.now();

        long appointmentsBooked =
                queueTokenRepository.countByBookingDate(today);

        long appointmentsCompleted = 0;
        long appointmentsWaiting = 0;
        long appointmentsInProgress = 0;
        long appointmentsCancelled = 0;

        List<Object[]> statusCounts = queueTokenRepository.countTodayAppointmentsByStatus(today);

        for (Object[] result : statusCounts) {
            QueueStatus status = (QueueStatus) result[0];
            long count = (long) result[1];

            switch (status) {
                case COMPLETED -> appointmentsCompleted = count;

                case WAITING -> appointmentsWaiting = count;

                case IN_PROGRESS -> appointmentsInProgress = count;

                case CANCELLED -> appointmentsCancelled = count;
            }
        }

        return AdminDashboardResponse.builder()
                .appointmentsBooked(appointmentsBooked)
                .appointmentsCompleted(appointmentsCompleted)
                .appointmentsWaiting(appointmentsWaiting)
                .appointmentsInProgress(appointmentsInProgress)
                .appointmentsCancelled(appointmentsCancelled)
                .activeDoctors(doctorRepository.countByIsActiveTrue())
                .activeReceptionists(receptionistRepository.countByIsActiveTrue())
                .activeDepartments(departmentRepository.countByIsActiveTrue())
                .build();
    }

    @Transactional(readOnly = true)
    public StaffProfileResponse getAdminProfile() {

        Administrator admin = getAuthenticatedAdmin();

        return StaffProfileResponse.builder()
                .fullName(admin.getFullName())
                .email(admin.getEmail())
                .phoneNumber(admin.getPhoneNumber())
                .role("ADMIN")
                .build();
    }

    public StaffProfileResponse updateAdminProfile(
            UpdateStaffProfileRequest request) {

        Administrator admin = getAuthenticatedAdmin();

        admin.setFullName(request.getFullName());
        admin.setEmail(request.getEmail());
        admin.setPhoneNumber(request.getPhoneNumber());

        administratorRepository.save(admin);

        return StaffProfileResponse.builder()
                .fullName(admin.getFullName())
                .email(admin.getEmail())
                .phoneNumber(admin.getPhoneNumber())
                .role("ADMIN")
                .build();
    }
}