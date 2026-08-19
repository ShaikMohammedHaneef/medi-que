package com.medique.repository;

import com.medique.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    public List<Department> findByIsActiveTrueOrderByNameAsc();

    public List<Department> findAllByOrderByNameAsc();

    public boolean existsByName(String name);

    long countByIsActiveTrue();
}
