package com.medique.mapper;

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
}