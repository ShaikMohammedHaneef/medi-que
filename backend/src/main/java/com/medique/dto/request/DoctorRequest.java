package com.medique.dto.request;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoctorRequest {

    private String doctorCode;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String qualification;
    private Long departmentId;
}
