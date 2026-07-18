package com.medique.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "administrator")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Administrator {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "administrator_id")
    private Long adminId ;
    @Column(nullable = false, name = "full_name")
    private String fullName;
    @Column(name = "email", nullable = false, unique = true)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "phone_number", nullable = false, unique = true)
    private String phoneNumber;
    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
}

