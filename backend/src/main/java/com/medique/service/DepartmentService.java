package com.medique.service;


import com.medique.dto.response.DepartmentAdminResponse;
import com.medique.dto.response.DepartmentResponse;
import com.medique.dto.request.DepartmentRequest;
import com.medique.entity.Department;
import com.medique.exception.DepartmentAlreadyExistsException;
import com.medique.exception.DepartmentNotFoundException;
import com.medique.mapper.DepartmentMapper;
import com.medique.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<DepartmentResponse> getAllActiveDepartments() {
        return DepartmentMapper.toResponse(departmentRepository.findByIsActiveTrueOrderByNameAsc());
    }

    public List<DepartmentAdminResponse> getAllDepartments() {
        return DepartmentMapper.toAdminResponse(departmentRepository.findAllByOrderByNameAsc());
    }

    public DepartmentResponse getDepartment(Long departmentId) {
        return DepartmentMapper.toResponse(findDepartmentOrThrow(departmentId));
    }

    public DepartmentResponse createDepartment(DepartmentRequest request) {

        Department department = DepartmentMapper.toEntity(request);

        if (departmentRepository.existsByName(department.getName()))
            throw new DepartmentAlreadyExistsException("Department '" + department.getName() + "' already Exists");

        return DepartmentMapper.toResponse(departmentRepository.save(department));
    }

    public DepartmentAdminResponse updateDepartment(Long departmentId, DepartmentRequest request) {

        Department department = findDepartmentOrThrow(departmentId);

        if( !department.getName().equals(request.getName()) && departmentRepository.existsByName(request.getName()) ){
            throw new DepartmentAlreadyExistsException("Department with name '" + request.getName() + "' already Exists");
        }

        department.setName(request.getName());
        department.setDescription(request.getDescription());

        return DepartmentMapper.toAdminResponse(departmentRepository.save(department));
    }

    public DepartmentAdminResponse activateDepartment(Long departmentId) {
        Department department = findDepartmentOrThrow(departmentId);
        department.setActive(true);
        return DepartmentMapper.toAdminResponse(departmentRepository.save(department));
    }

    public DepartmentAdminResponse deactivateDepartment(Long departmentId) {
        Department department = findDepartmentOrThrow(departmentId);
        department.setActive(false);
        return DepartmentMapper.toAdminResponse(departmentRepository.save(department));
    }

    private Department findDepartmentOrThrow(Long departmentId){
        return departmentRepository.findById(departmentId)
                .orElseThrow(()-> new DepartmentNotFoundException("Department not found with id : " + departmentId));
    }
}
