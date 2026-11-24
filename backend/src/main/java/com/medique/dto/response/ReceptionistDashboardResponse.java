package com.medique.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceptionistDashboardResponse {

    private long appointmentsBooked;
    private long waiting;
    private long inProgress;
    private long completed;
    private long cancelled;
}