package com.medique.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DoctorResponse {

    private Long doctorId;
    private String doctorCode;
    private String fullName;
    private String qualification;

}

