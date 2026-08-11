package com.medique.dto.request;

import com.medique.enums.Gender;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TokenBookingRequest {
    private String fullName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String phoneNumber;
    private Long doctorId;
}
