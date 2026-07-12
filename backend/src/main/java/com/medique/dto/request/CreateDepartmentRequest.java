package com.medique.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateDepartmentRequest {
    private String name;
    private String description;
}
