package com.medique.mapper;

import com.medique.dto.request.PatientRequest;
import com.medique.dto.response.PatientResponse;
import com.medique.entity.Patient;

public class PatientMapper {

    public static Patient toEntity(PatientRequest request) {

        return Patient.builder()
                .fullName(request.getFullName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .phoneNumber(request.getPhoneNumber())
                .build();
    }

    public static PatientResponse toResponse(Patient patient) {

        return PatientResponse.builder()
                .patientId(patient.getPatientId())
                .fullName(patient.getFullName())
                .dateOfBirth(patient.getDateOfBirth())
                .gender(patient.getGender())
                .phoneNumber(patient.getPhoneNumber())
                .build();
    }
}