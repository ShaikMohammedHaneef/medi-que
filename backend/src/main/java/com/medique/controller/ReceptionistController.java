package com.medique.controller;

import com.medique.dto.request.CreateReceptionistRequest;
import com.medique.dto.request.ReceptionistRequest;
import com.medique.dto.response.ReceptionistResponse;
import com.medique.service.ReceptionistService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
public class ReceptionistController {

    private final ReceptionistService receptionistService;

    public ReceptionistController(ReceptionistService receptionistService) {
        this.receptionistService = receptionistService;
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
    public ResponseEntity<ReceptionistResponse> updateReceptionist(@PathVariable Long receptionistId, @RequestBody ReceptionistRequest request){
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
}
