package com.medique.dto.response;

import com.medique.enums.QueueStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QueueTrackingResponse {
    private String tokenNumber;
    private QueueStatus status;
    private int queuePosition;
    private int waitTime;
}
