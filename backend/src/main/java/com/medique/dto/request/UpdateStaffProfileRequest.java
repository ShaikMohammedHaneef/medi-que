package com.medique.dto.request;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStaffProfileRequest {
    private String fullName;
    private String email;
    private String phoneNumber;
}
