package com.medique.service;


import com.medique.entity.Department;
import com.medique.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository){
        this.departmentRepository = departmentRepository;
    }

    public List<Department> getAllActiveDepartments(){
        return departmentRepository.findByIsActiveTrue();
    }

    public List<Department> getAllDepartments(){
        return departmentRepository.findAll();
    }

    public void createDepartment(Department department){

    }

    public void updateDepartment(Long departmentId, Department department){

    }
    public void activateDepartment(Long departmentId){

    }
    public void deactivateDepartment(Long departmentId){

    }
}
