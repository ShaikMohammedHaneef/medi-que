package com.medique.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {

    private long appointmentsBooked;
    private long appointmentsCompleted;
    private long appointmentsWaiting;
    private long appointmentsInProgress;
    private long appointmentsCancelled;
    private long activeDoctors;
    private long activeReceptionists;
    private long activeDepartments;
}
