package com.medique.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceptionistResponse {
    private Long receptionistId;
    private String fullName;
    private String email;
    private String phoneNumber;
    private boolean isActive;
}
