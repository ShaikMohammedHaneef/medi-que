package com.medique.dto.response;


import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TokenBookingResponse {

        private Long patientId;
        private Long doctorId;
        private String doctorName;
        private String tokenNumber;
        private LocalDate bookingDate;
        private String status;
}
