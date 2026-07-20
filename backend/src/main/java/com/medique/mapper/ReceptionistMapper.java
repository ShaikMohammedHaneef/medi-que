package com.medique.mapper;

import com.medique.dto.request.CreateReceptionistRequest;
import com.medique.dto.response.ReceptionistResponse;
import com.medique.entity.Receptionist;

import java.util.List;

public class ReceptionistMapper {

    public static ReceptionistResponse toResponse(Receptionist receptionist) {
        return ReceptionistResponse.builder()
                .receptionistId(receptionist.getReceptionistId())
                .fullName(receptionist.getFullName())
                .email(receptionist.getEmail())
                .phoneNumber(receptionist.getPhoneNumber())
                .isActive(receptionist.isActive())
                .build();
    }

    public static List<ReceptionistResponse> toResponse(List<Receptionist> receptionists) {
        return receptionists.stream()
                .map(ReceptionistMapper::toResponse)
                .toList();
    }

    public static Receptionist toEntity(CreateReceptionistRequest request) {
        return Receptionist.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .build();
    }
}
