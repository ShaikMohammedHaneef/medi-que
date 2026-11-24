package com.medique.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoctorReceptionistResponse {
    private Long doctorId;
    private String doctorCode;
    private String fullName;
    private String DepartmentName;
}
