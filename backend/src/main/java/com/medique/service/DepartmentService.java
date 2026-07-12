package com.medique.service;


import com.medique.dto.response.DepartmentResponse;
import com.medique.dto.request.CreateDepartmentRequest;
import com.medique.entity.Department;
import com.medique.exception.DepartmentAlreadyExistsException;
import com.medique.exception.DepartmentNotFoundException;
import com.medique.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllActiveDepartments() {
        return departmentRepository.findByIsActiveTrueOrderByNameAsc();
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAllByOrderByNameAsc();
    }

    public DepartmentResponse getDepartment(Long departmentId) {
        Department department = departmentRepository.findById(departmentId).orElseThrow(() -> new DepartmentNotFoundException("Department not found with id:" + departmentId));
        return new DepartmentResponse(
                department.getDepartmentId(),
                department.getName(),
                department.getDescription());
    }

    public DepartmentResponse createDepartment(CreateDepartmentRequest request) {

        Department department = new Department();

        department.setName(request.getName());
        department.setDescription(request.getDescription());

        if (departmentRepository.existsByName(department.getName()))
            throw new DepartmentAlreadyExistsException("Department '" + department.getName() + "' already Exists");


        Department savedDepartment = departmentRepository.save(department);
        return new DepartmentResponse(savedDepartment.getDepartmentId(),
                savedDepartment.getName(),
                savedDepartment.getDescription()
        );
    }

}
