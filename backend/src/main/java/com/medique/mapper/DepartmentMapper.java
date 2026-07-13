package com.medique.mapper;

import com.medique.dto.request.DepartmentRequest;
import com.medique.dto.response.DepartmentAdminResponse;
import com.medique.dto.response.DepartmentResponse;
import com.medique.entity.Department;

import java.util.ArrayList;
import java.util.List;

public class DepartmentMapper {

    public static Department toEntity(DepartmentRequest request) {
        return Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
    }

    public static DepartmentResponse toResponse(Department department) {
        return DepartmentResponse.builder()
                .departmentId(department.getDepartmentId())
                .name(department.getName())
                .description(department.getDescription())
                .build();
    }

    public static List<DepartmentResponse> toResponse(List<Department> departments) {

        return departments.stream()
                .map(DepartmentMapper::toResponse)
                .toList();
    }

    public static List<DepartmentAdminResponse> toAdminResponse(List<Department> departments) {

        return departments.stream()
                .map((department) -> DepartmentAdminResponse.builder()
                        .departmentId(department.getDepartmentId())
                        .name(department.getName())
                        .description(department.getDescription())
                        .isActive(department.isActive())
                        .build())
                .toList();
    }

    public static DepartmentAdminResponse toAdminResponse(Department department) {

        return DepartmentAdminResponse.builder()
                .departmentId(department.getDepartmentId())
                .name(department.getName())
                .description(department.getDescription())
                .isActive(department.isActive())
                .build();
    }
}
