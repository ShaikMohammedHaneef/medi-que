package com.medique.controller;


import com.medique.dto.request.PatientRequest;
import com.medique.dto.request.TokenBookingRequest;
import com.medique.dto.response.PatientResponse;
import com.medique.dto.response.TokenBookingResponse;
import com.medique.service.PatientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService){
        this.patientService = patientService;
    }

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<PatientResponse> getPatientById(@PathVariable Long patientId){
        return ResponseEntity.ok(patientService.getPatientById(patientId));
    }

    @PutMapping("/patients/{patientId}")
    public ResponseEntity<PatientResponse> updatePatient(@RequestBody PatientRequest request, @PathVariable Long patientId){
        return ResponseEntity.ok(patientService.updatePatient(request, patientId));
    }

    @PostMapping("/patients/book")
    public ResponseEntity<TokenBookingResponse> bookOP(@RequestBody TokenBookingRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.bookOP(request));
    }
}
