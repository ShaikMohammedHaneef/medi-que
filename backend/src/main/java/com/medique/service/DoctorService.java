package com.medique.service;

import com.medique.dto.response.DoctorResponse;
import com.medique.entity.Department;
import com.medique.exception.DepartmentNotFoundException;
import com.medique.mapper.DoctorMapper;
import com.medique.repository.DepartmentRepository;
import com.medique.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;

    public DoctorService(DoctorRepository doctorRepository, DepartmentRepository departmentRepository){
        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
    }
    public List<DoctorResponse> getDoctorsByDepartment(Long departmentId) {
        findDepartmentOrThrow(departmentId);
        return DoctorMapper.toResponse(doctorRepository.findActiveAndAvailableDoctorsByDepartment(departmentId));
    }

    private Department findDepartmentOrThrow(Long departmentId){
        return departmentRepository.findById(departmentId)
                .orElseThrow(()-> new DepartmentNotFoundException("Department not found with id : " + departmentId));
    }
}
