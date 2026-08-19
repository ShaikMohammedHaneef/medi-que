package com.medique.service;

import com.medique.dto.response.AdminDashboardResponse;
import com.medique.entity.QueueToken;
import com.medique.enums.QueueStatus;
import com.medique.repository.DepartmentRepository;
import com.medique.repository.DoctorRepository;
import com.medique.repository.QueueTokenRepository;
import com.medique.repository.ReceptionistRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AdminService {

    private final QueueTokenRepository queueTokenRepository;
    private final DoctorRepository doctorRepository;
    private final ReceptionistRepository receptionistRepository;
    private final DepartmentRepository departmentRepository;

    public AdminService(
            QueueTokenRepository queueTokenRepository,
            DoctorRepository doctorRepository,
            ReceptionistRepository receptionistRepository,
            DepartmentRepository departmentRepository) {

        this.queueTokenRepository = queueTokenRepository;
        this.doctorRepository = doctorRepository;
        this.receptionistRepository = receptionistRepository;
        this.departmentRepository = departmentRepository;
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
}