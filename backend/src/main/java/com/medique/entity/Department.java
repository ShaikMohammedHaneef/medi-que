package com.medique.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "department")
@Getter
@Setter
@NoArgsConstructor
public class Department {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Long departmentId;
    @Column(nullable = false, unique = true)
    private String name;
    @Column(nullable = false)
    private String description;
    @Column(name = "is_active",nullable = false)
    private boolean isActive = true;
}
