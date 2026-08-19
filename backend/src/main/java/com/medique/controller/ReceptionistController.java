package com.medique.controller;

import com.medique.dto.request.CreateReceptionistRequest;
import com.medique.dto.request.ReceptionistRequest;
import com.medique.dto.request.TokenBookingRequest;
import com.medique.dto.response.DoctorQueueResponse;
import com.medique.dto.response.QueueTrackingResponse;
import com.medique.dto.response.ReceptionistResponse;
import com.medique.dto.response.TokenBookingResponse;
import com.medique.service.PatientService;
import com.medique.service.QueueTokenService;
import com.medique.service.ReceptionistService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ReceptionistController {

    private final ReceptionistService receptionistService;
    private final PatientService patientService;
    private final QueueTokenService queueTokenService;

    public ReceptionistController(ReceptionistService receptionistService,
                                  PatientService patientService,
                                  QueueTokenService queueTokenService) {
        this.receptionistService = receptionistService;
        this.patientService = patientService;
        this.queueTokenService = queueTokenService;
    }

    @GetMapping("/admin/receptionists")
    public ResponseEntity<List<ReceptionistResponse>> getReceptionists(){
        return ResponseEntity.ok(receptionistService.getReceptionists());
    }

    @GetMapping("/admin/receptionists/{receptionistId}")
    public ResponseEntity<ReceptionistResponse> getReceptionistById(@PathVariable Long receptionistId){
        return ResponseEntity.ok(receptionistService.getReceptionistById(receptionistId));
    }

    @PostMapping("/admin/receptionists")
    public ResponseEntity<ReceptionistResponse> createReceptionist(@RequestBody CreateReceptionistRequest request){
        ReceptionistResponse response = receptionistService.createReceptionist(request);
        URI location = URI.create("/api/admin/receptionists/"+response.getReceptionistId());
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/admin/receptionists/{receptionistId}")
    public ResponseEntity<ReceptionistResponse> updateReceptionist(@PathVariable Long receptionistId,
                                                                   @RequestBody ReceptionistRequest request){
        ReceptionistResponse response = receptionistService.updateReceptionist(receptionistId, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/receptionists/{receptionistId}/activate")
    public ResponseEntity<ReceptionistResponse> activateReceptionist(@PathVariable Long receptionistId){
        ReceptionistResponse response = receptionistService.activateReceptionist(receptionistId);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/admin/receptionists/{receptionistId}/deactivate")
    public ResponseEntity<ReceptionistResponse> deactivateReceptionist(@PathVariable Long receptionistId) {
        ReceptionistResponse response = receptionistService.deactivateReceptionist(receptionistId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/receptionists/book")
    public ResponseEntity<TokenBookingResponse> bookOP(@RequestBody TokenBookingRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(patientService.bookOP(request));
    }

    @PatchMapping("/receptionists/cancel/{tokenNumber}")
    public ResponseEntity<QueueTrackingResponse> cancelOp(@PathVariable String tokenNumber){
        return ResponseEntity.ok(queueTokenService.cancelQueueToken(tokenNumber));
    }

    @GetMapping("/receptionists/queue/{doctorCode}")
    public ResponseEntity<List<DoctorQueueResponse>> getDoctorQueue(@PathVariable String doctorCode) {
        return ResponseEntity.ok(receptionistService.getDoctorQueue(doctorCode));
    }
}
