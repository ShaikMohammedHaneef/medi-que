package com.medique.controller;

import com.medique.entity.Department;
import com.medique.service.DepartmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RequestMapping("/api")
@RestController
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService){
        this.departmentService = departmentService;
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllActiveDepartments(){
        return new ResponseEntity<>(departmentService.getAllActiveDepartments(), HttpStatus.OK);
    }
}
