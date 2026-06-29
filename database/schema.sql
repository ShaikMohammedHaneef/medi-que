-- ============================================================
-- MediQue Database Schema
-- Database : PostgreSQL
--
-- Description:
-- This script creates the complete database schema for the
-- MediQue Hospital Outpatient (OP) Queue Management System.
--
-- It includes:
--   - ENUM types
--   - Database tables
--   - Primary keys
--   - Foreign keys
--   - Constraints
-- ============================================================


-- ============================================================
-- ENUM Types
-- ============================================================

CREATE TYPE gender AS ENUM (
    'MALE',
    'FEMALE',
    'OTHER'
);

CREATE TYPE queue_status AS ENUM (
    'WAITING',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
);

-- ============================================================
-- Department Table
-- ============================================================

CREATE TABLE department (
    department_id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- Doctor Table
-- ============================================================

CREATE TABLE doctor (
    doctor_id BIGSERIAL PRIMARY KEY,
    doctor_code CHAR(2) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    qualification VARCHAR(100) NOT NULL,
    department_id BIGINT NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_doctor_department
        FOREIGN KEY (department_id)
        REFERENCES department(department_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- ============================================================
-- Receptionist Table
-- ============================================================

CREATE TABLE receptionist (
    receptionist_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- Administrator Table
-- ============================================================

CREATE TABLE administrator (
    administrator_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- Patient Table
-- ============================================================

CREATE TABLE patient (
    patient_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender NOT NULL,
    phone_number VARCHAR(15) NOT NULL UNIQUE
);

-- ============================================================
-- QueueToken Table
-- ============================================================

CREATE TABLE queue_token (
    queue_token_id BIGSERIAL PRIMARY KEY,
    token_number VARCHAR(10) NOT NULL,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    status queue_status NOT NULL,
    booking_date DATE NOT NULL,
    booked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_queue_token
        UNIQUE (booking_date, token_number),

    CONSTRAINT fk_queue_patient
        FOREIGN KEY (patient_id)
        REFERENCES patient(patient_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_queue_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctor(doctor_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);