package com.medique.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceptionistRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
}
