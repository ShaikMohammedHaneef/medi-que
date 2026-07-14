package com.medique.dto.request;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateDoctorRequest {

    private String doctorCode;
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;
    private String qualification;
    private Long departmentId;
}
