package com.medique.dto.response;

import com.medique.enums.QueueStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorQueueResponse {
    private String tokenNumber;
    private Long patientId;
    private String patientName;
    private QueueStatus status;
    private LocalDateTime bookedAt;
    private int queuePosition;
}