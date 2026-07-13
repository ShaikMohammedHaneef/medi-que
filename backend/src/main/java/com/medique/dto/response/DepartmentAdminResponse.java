package com.medique.dto.response;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentAdminResponse {

    private Long departmentId;
    private String name;
    private String description;
    private boolean isActive;
}
