package com.medique.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateReceptionistRequest {
    private String fullName;
    private String email;
    private String password;
    private String phoneNumber;

}
