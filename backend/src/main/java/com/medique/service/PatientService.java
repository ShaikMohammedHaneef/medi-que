package com.medique.service;


import com.medique.dto.request.PatientRequest;
import com.medique.dto.response.PatientResponse;
import com.medique.entity.Patient;
import com.medique.exception.PatientAlreadyExistsException;
import com.medique.exception.PatientNotFoundException;
import com.medique.mapper.PatientMapper;
import com.medique.repository.PatientRepository;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    private Patient findPatientOrThrow(Long patientId) {
        return patientRepository.findById(patientId).orElseThrow(() -> new PatientNotFoundException("Patient not found with id :" + patientId));
    }

    public PatientResponse getPatientById(Long patientId) {
        return PatientMapper.toResponse(findPatientOrThrow(patientId));
    }

    public PatientResponse updatePatient(PatientRequest request, Long patientId) {
        Patient patient = findPatientOrThrow(patientId);

        Patient existingPatient = patientRepository.findUniquePatient(
                        request.getFullName(),
                        request.getDateOfBirth(),
                        request.getPhoneNumber())
                .orElse(null);

        if (existingPatient != null &&
                !existingPatient.getPatientId().equals(patientId)) {

            throw new PatientAlreadyExistsException(
                    "A patient with the same name, date of birth and phone number already exists"
            );
        }


        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setFullName(request.getFullName());
        patient.setPhoneNumber(request.getPhoneNumber());

        return PatientMapper.toResponse(patientRepository.save(patient));
    }
}
