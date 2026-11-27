package com.medique.controller;

import com.medique.dto.request.UpdateStaffProfileRequest;
import com.medique.dto.response.AdminDashboardResponse;
import com.medique.dto.response.StaffProfileResponse;
import com.medique.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService){
        this.adminService = adminService;
    }

    @GetMapping("/admin/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("admin/profile")
    public ResponseEntity<StaffProfileResponse> getAdminProfile() {
        return ResponseEntity.ok(adminService.getAdminProfile());
    }

    @PutMapping("admin/profile")
    public ResponseEntity<StaffProfileResponse> updateProfile(
            @RequestBody UpdateStaffProfileRequest request) {

        return ResponseEntity.ok(
                adminService.updateAdminProfile(request)
        );
    }
}
