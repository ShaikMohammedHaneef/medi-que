package com.medique.mapper;

import com.medique.dto.response.DoctorResponse;
import com.medique.entity.Doctor;

import java.util.List;

public class DoctorMapper {

    public static DoctorResponse toResponse(Doctor doctor){
        return DoctorResponse.builder()
                .doctorId(doctor.getDoctorId())
                .doctorCode(doctor.getDoctorCode())
                .fullName(doctor.getFullName())
                .qualification(doctor.getQualification())
                .build();
    }

    public static List<DoctorResponse> toResponse(List<Doctor> doctors){
        return doctors.stream()
                .map(DoctorMapper::toResponse)
                .toList();
    }
}
