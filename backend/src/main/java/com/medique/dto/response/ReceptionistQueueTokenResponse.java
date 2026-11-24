package com.medique.dto.response;

import com.medique.enums.QueueStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceptionistQueueTokenResponse {

    private String tokenNumber;
    private Long patientId;
    private String patientName;
    private String doctorCode;
    private String doctorName;
    private String departmentName;
    private QueueStatus status;
    private LocalDateTime bookedAt;
}