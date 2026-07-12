package com.medique.controller;

import com.medique.dto.response.DepartmentResponse;
import com.medique.dto.request.CreateDepartmentRequest;
import com.medique.entity.Department;
import com.medique.service.DepartmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;


@RequestMapping("/api")
@RestController
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping("/departments")
    public ResponseEntity<List<Department>> getAllActiveDepartments() {
        return ResponseEntity.status(HttpStatus.OK).body(departmentService.getAllActiveDepartments());
    }

    @GetMapping("/departments/{departmentId}")
    public ResponseEntity<DepartmentResponse> getDepartment(@PathVariable Long departmentId) {
        DepartmentResponse response = departmentService.getDepartment(departmentId);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/admin/departments")
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.status(HttpStatus.OK).body(departmentService.getAllDepartments());
    }

    @PostMapping("/admin/departments")
    public ResponseEntity<DepartmentResponse> createDepartment(@RequestBody CreateDepartmentRequest request) {
        DepartmentResponse response = departmentService.createDepartment(request);
        URI location = URI.create("/api/departments/"+response.getDepartmentId());

        return ResponseEntity.created(location).body(response);
    }

}
