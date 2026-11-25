package com.medique.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffProfileResponse {
    private String fullName;
    private String email;
    private String phoneNumber;
    private String role;


    private String doctorCode;
    private String qualification;
    private String departmentName;
}
