package com.medique.controller;

import com.medique.dto.request.CreateDoctorRequest;
import com.medique.dto.request.DepartmentRequest;
import com.medique.dto.request.DoctorRequest;
import com.medique.dto.response.DepartmentAdminResponse;
import com.medique.dto.response.DoctorAdminResponse;
import com.medique.dto.response.DoctorResponse;
import com.medique.entity.Doctor;
import com.medique.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
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
        return ResponseEntity.ok(doctorService.getDoctorsByDepartment(departmentId));
    }

    @GetMapping("/admin/doctors/{doctorId}")
    public ResponseEntity<DoctorAdminResponse> getDoctorById(@PathVariable Long doctorId){
        return ResponseEntity.ok(doctorService.getDoctorById(doctorId));
    }

    @GetMapping("/admin/doctors")
    public ResponseEntity<List<DoctorAdminResponse>> getDoctors(){
        return ResponseEntity.ok(doctorService.getDoctors());
    }

    @PostMapping("/admin/doctors")
    public ResponseEntity<DoctorAdminResponse> createDoctor(@RequestBody CreateDoctorRequest request){
        DoctorAdminResponse response = doctorService.createDoctor(request);
        URI location = URI.create("/api/admin/doctors/"+response.getDoctorId());
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/admin/doctors/{doctorId}")
    public ResponseEntity<DoctorAdminResponse> updateDoctor(@PathVariable Long doctorId, @RequestBody DoctorRequest request) {
        DoctorAdminResponse response = doctorService.updateDoctor(doctorId, request);
        return ResponseEntity.ok(response);
    }
    @PatchMapping("/admin/doctors/{doctorId}/deactivate")
    public ResponseEntity<DoctorAdminResponse> deactivateDoctor(@PathVariable Long doctorId) {
        DoctorAdminResponse response = doctorService.deactivateDoctor(doctorId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/doctors/{doctorId}/activate")
    public ResponseEntity<DoctorAdminResponse> activateDoctor(@PathVariable Long doctorId) {
        DoctorAdminResponse response = doctorService.activateDoctor(doctorId);
        return ResponseEntity.ok(response);
    }
}
