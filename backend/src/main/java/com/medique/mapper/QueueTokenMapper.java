package com.medique.mapper;

import com.medique.dto.response.DoctorQueueResponse;
import com.medique.dto.response.QueueTrackingResponse;
import com.medique.entity.QueueToken;

public class QueueTokenMapper {

    public static QueueTrackingResponse toTrackingResponse(
            QueueToken queueToken,
            int queuePosition,
            int patientsAhead,
            int waitTime) {

        return QueueTrackingResponse.builder()
                .tokenNumber(queueToken.getTokenNumber())
                .patientName(queueToken.getPatient().getFullName())
                .doctorName(queueToken.getDoctor().getFullName())
                .departmentName(
                        queueToken.getDoctor().getDepartment().getName())
                .departmentDescription(
                        queueToken.getDoctor().getDepartment().getDescription())
                .status(queueToken.getStatus())
                .queuePosition(queuePosition)
                .patientsAhead(patientsAhead)
                .waitTime(waitTime)
                .build();
    }

    public static DoctorQueueResponse toDoctorQueueResponse(QueueToken queueToken, int queuePosition){
        return DoctorQueueResponse.builder()
                .tokenNumber(queueToken.getTokenNumber())
                .patientId(queueToken.getPatient().getPatientId())
                .patientName(queueToken.getPatient().getFullName())
                .status(queueToken.getStatus())
                .bookedAt(queueToken.getBookedAt())
                .queuePosition(queuePosition)
                .build();
    }
}