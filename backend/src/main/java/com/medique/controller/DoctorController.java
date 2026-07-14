package com.medique.controller;

import com.medique.dto.response.DoctorResponse;
import com.medique.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/api")
@RestController
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService){
        this.doctorService = doctorService;
    }

    @GetMapping("/departments/{departmentId}/doctors")
    public ResponseEntity<List<DoctorResponse>> getDoctorsByDepartment(@PathVariable Long departmentId){
        List<DoctorResponse> response = doctorService.getDoctorsByDepartment(departmentId);
        return ResponseEntity.ok(response);
    }
}
