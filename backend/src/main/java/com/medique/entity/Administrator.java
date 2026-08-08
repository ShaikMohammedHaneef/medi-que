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
    @Column(nullable = false, name = "full_name", length = 100)
    private String fullName;
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;
    @Column(name = "password", nullable = false, length = 255)
    private String password;
    @Column(name = "phone_number", nullable = false, unique = true, length = 15)
    private String phoneNumber;
    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
}

