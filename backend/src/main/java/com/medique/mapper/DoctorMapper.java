package com.medique.mapper;

import com.medique.dto.request.CreateDoctorRequest;
import com.medique.dto.request.DoctorRequest;
import com.medique.dto.response.DoctorAdminResponse;
import com.medique.dto.response.DoctorReceptionistResponse;
import com.medique.dto.response.DoctorResponse;
import com.medique.dto.response.StaffProfileResponse;
import com.medique.entity.Doctor;

import java.util.List;

public class DoctorMapper {

    public static DoctorResponse toResponse(Doctor doctor) {
        return DoctorResponse.builder()
                .doctorId(doctor.getDoctorId())
                .doctorCode(doctor.getDoctorCode())
                .fullName(doctor.getFullName())
                .qualification(doctor.getQualification())
                .build();
    }

    public static List<DoctorResponse> toResponse(List<Doctor> doctors) {
        return doctors.stream()
                .map(DoctorMapper::toResponse)
                .toList();
    }

    public static Doctor toEntity(CreateDoctorRequest request) {
        return Doctor.builder()
                .doctorCode(request.getDoctorCode())
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .qualification(request.getQualification())
                .build();
    }

    public static DoctorAdminResponse toAdminResponse(Doctor doctor) {
        return DoctorAdminResponse.builder()
                .doctorId(doctor.getDoctorId())
                .doctorCode(doctor.getDoctorCode())
                .fullName(doctor.getFullName())
                .email(doctor.getEmail())
                .departmentName(doctor.getDepartment().getName())
                .qualification(doctor.getQualification())
                .isActive(doctor.isActive())
                .isAvailable(doctor.isAvailable())
                .phoneNumber(doctor.getPhoneNumber())
                .build();
    }

    public static List<DoctorAdminResponse> toAdminResponse(List<Doctor> doctors) {
        return doctors.stream()
                .map(DoctorMapper::toAdminResponse)
                .toList();
    }

    public static DoctorReceptionistResponse toReceptionistResponse(Doctor doctor) {
        return DoctorReceptionistResponse.builder()
                .doctorId(doctor.getDoctorId())
                .doctorCode(doctor.getDoctorCode())
                .fullName(doctor.getFullName())
                .DepartmentName(doctor.getDepartment().getName())
                .build();
    }

    public static List<DoctorReceptionistResponse> toReceptionistResponse(List<Doctor> doctors) {
        return doctors.stream()
                .map(DoctorMapper::toReceptionistResponse)
                .toList();
    }

    public static StaffProfileResponse toProfileReponse(Doctor doctor) {
        return StaffProfileResponse.builder()
                .fullName(doctor.getFullName())
                .email(doctor.getEmail())
                .phoneNumber(doctor.getPhoneNumber())
                .role("DOCTOR")
                .doctorCode(doctor.getDoctorCode())
                .qualification(doctor.getQualification())
                .departmentName(doctor.getDepartment().getName())
                .build();
    }
}
