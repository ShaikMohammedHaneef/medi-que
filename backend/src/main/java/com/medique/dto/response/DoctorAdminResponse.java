package com.medique.dto.response;

import com.medique.entity.Department;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoctorAdminResponse {
    private Long doctorId;
    private String doctorCode;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String qualification;
    private String  departmentName;
    private boolean isActive = true;
    private boolean isAvailable = true;
}
