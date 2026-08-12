package com.medique.controller;


import com.medique.dto.request.PatientRequest;
import com.medique.dto.request.TokenBookingRequest;
import com.medique.dto.response.PatientResponse;
import com.medique.dto.response.QueueTrackingResponse;
import com.medique.dto.response.TokenBookingResponse;
import com.medique.entity.QueueToken;
import com.medique.service.PatientService;
import com.medique.service.QueueTokenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api")
public class PatientController {

    private final PatientService patientService;
    private final QueueTokenService queueTokenService;

    public PatientController(PatientService patientService, QueueTokenService queueTokenService){

        this.patientService = patientService;
        this.queueTokenService = queueTokenService;
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

    @GetMapping("/patients/track/{tokenNumber}")
    public ResponseEntity<QueueTrackingResponse> trackQueue(@PathVariable String tokenNumber){
        return ResponseEntity.ok(queueTokenService.trackQueue(tokenNumber));
    }
}
