package com.medique.service;

import com.medique.dto.request.CreateDoctorRequest;
import com.medique.dto.request.DoctorRequest;
import com.medique.dto.response.DoctorAdminResponse;
import com.medique.dto.response.DoctorResponse;
import com.medique.entity.Department;
import com.medique.entity.Doctor;
import com.medique.exception.*;
import com.medique.mapper.DoctorMapper;
import com.medique.repository.DepartmentRepository;
import com.medique.repository.DoctorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorService(
            DoctorRepository doctorRepository,
            DepartmentRepository departmentRepository,
            PasswordEncoder passwordEncoder) {

        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private Department findDepartmentOrThrow(Long departmentId) {
        return departmentRepository.findById(departmentId)
                .orElseThrow(() -> new DepartmentNotFoundException("Department not found with id : " + departmentId));
    }

    private Doctor findDoctorOrThrow(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new DoctorNotFoundException("Doctor not found with id : " + doctorId));
    }

    public List<DoctorResponse> getDoctorsByDepartment(Long departmentId) {
        findDepartmentOrThrow(departmentId);
        return DoctorMapper.toResponse(doctorRepository.findActiveAndAvailableDoctorsByDepartment(departmentId));
    }

    public List<DoctorAdminResponse> getDoctors(){
        return DoctorMapper.toAdminResponse(doctorRepository.findAll());
    }


    public DoctorAdminResponse createDoctor(CreateDoctorRequest request) {
        Department department = findDepartmentOrThrow(request.getDepartmentId());

        if (doctorRepository.existsByDoctorCode(request.getDoctorCode()))
            throw new DoctorAlreadyExistsException("doctor already exists with Doctor Code " + request.getDoctorCode());
        if (doctorRepository.existsByEmail(request.getEmail()))
            throw new DoctorAlreadyExistsException("doctor already exists with Email " + request.getEmail());
        if (doctorRepository.existsByPhoneNumber(request.getPhoneNumber()))
            throw new DoctorAlreadyExistsException("doctor already exists with Phone Number " + request.getPhoneNumber());
        if (!department.isActive()) {
            throw new DepartmentInactiveException("Cannot assign a doctor to an inactive department.");
        }
        Doctor doctor = DoctorMapper.toEntity(request);
        doctor.setDepartment(department);
        doctor.setPassword(passwordEncoder.encode(request.getPassword()));

        return DoctorMapper.toAdminResponse(doctorRepository.save(doctor));
    }

    public DoctorAdminResponse getDoctorById(Long doctorId) {
        return DoctorMapper.toAdminResponse(findDoctorOrThrow(doctorId));
    }

    public DoctorAdminResponse updateDoctor(Long doctorId, DoctorRequest request) {
        Doctor doctor = findDoctorOrThrow(doctorId);
        Department department = findDepartmentOrThrow(request.getDepartmentId());

        if (!department.isActive())
            throw new DepartmentInactiveException("Cannot assign a doctor to an inactive department.");

        if (!doctor.getEmail().equals(request.getEmail()) && doctorRepository.existsByEmail(request.getEmail()))
            throw new DoctorAlreadyExistsException("doctor with email '" + request.getEmail() + "' already Exists");

        if (!doctor.getDoctorCode().equals(request.getDoctorCode()) && doctorRepository.existsByDoctorCode(request.getDoctorCode()))
            throw new DoctorAlreadyExistsException("doctor  with Doctor Code '" + request.getDoctorCode() + "' already Exists");

        if (!doctor.getPhoneNumber().equals(request.getPhoneNumber()) && doctorRepository.existsByPhoneNumber(request.getPhoneNumber()))
            throw new DoctorAlreadyExistsException("doctor with Phone Number '" + request.getPhoneNumber() + "' already exists ");

        doctor.setDoctorCode(request.getDoctorCode());
        doctor.setFullName(request.getFullName());
        doctor.setEmail(request.getEmail());
        doctor.setPhoneNumber(request.getPhoneNumber());
        doctor.setQualification(request.getQualification());
        doctor.setDepartment(department);

        return DoctorMapper.toAdminResponse(doctorRepository.save(doctor));
    }

    public DoctorAdminResponse deactivateDoctor(Long doctorId) {
        Doctor doctor = findDoctorOrThrow(doctorId);
        doctor.setActive(false);
        doctor.setAvailable(false);
        return DoctorMapper.toAdminResponse(doctorRepository.save(doctor));
    }

    public DoctorAdminResponse activateDoctor(Long doctorId) {
        Doctor doctor = findDoctorOrThrow(doctorId);
        doctor.setActive(true);
        return DoctorMapper.toAdminResponse(doctorRepository.save(doctor));
    }
}
