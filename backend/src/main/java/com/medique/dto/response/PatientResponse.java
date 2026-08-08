package com.medique.dto.response;

import com.medique.enums.Gender;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientResponse {

    private Long patientId;
    private String fullName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String phoneNumber;
}