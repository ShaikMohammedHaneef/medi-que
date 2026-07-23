package com.medique.security;

import com.medique.entity.Administrator;
import com.medique.entity.Doctor;
import com.medique.entity.Receptionist;
import com.medique.repository.AdministratorRepository;
import com.medique.repository.DoctorRepository;
import com.medique.repository.ReceptionistRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final DoctorRepository doctorRepository;
    private final ReceptionistRepository receptionistRepository;
    private final AdministratorRepository administratorRepository;

    public CustomUserDetailsService(
            DoctorRepository doctorRepository,
            ReceptionistRepository receptionistRepository,
            AdministratorRepository administratorRepository){

        this.doctorRepository = doctorRepository;
        this.receptionistRepository = receptionistRepository;
        this.administratorRepository = administratorRepository;

    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Administrator administrator = administratorRepository.findByEmail(username).orElse(null);
        if(administrator != null ){
            return new CustomUserDetails(
                    administrator.getEmail(),
                    administrator.getPassword(),
                    administrator.isActive(),
                    List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        Doctor doctor = doctorRepository.findByEmail(username).orElse(null);
        if(doctor != null ){
            return new CustomUserDetails(
                    doctor.getEmail(),
                    doctor.getPassword(),
                    doctor.isActive(),
                    List.of(new SimpleGrantedAuthority("ROLE_DOCTOR"))
            );
        }

        Receptionist receptionist = receptionistRepository.findByEmail(username).orElse(null);
        if(receptionist != null ){
            return new CustomUserDetails(
                    receptionist.getEmail(),
                    receptionist.getPassword(),
                    receptionist.isActive(),
                    List.of(new SimpleGrantedAuthority("ROLE_RECEPTIONIST"))
            );
        }
        throw new UsernameNotFoundException("User not found with email '"+username+"'");

    }
}
