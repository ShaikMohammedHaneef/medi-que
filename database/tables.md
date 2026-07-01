# Database Tables

## Overview

This document describes all the database tables used in the MediQue system, including their purpose, columns, constraints, and relationships.

<br>

# 1. Department

## Purpose

The **Department** table stores the hospital departments available in the system. Each doctor belongs to one department, allowing patients to book an OP appointment with doctors from the appropriate department.

### Columns

| Column| Data Type| Constraints| Description|
| ----- | -------- | ---------- | ---------- |
| `department_id` | BIGSERIAL    | Primary Key            | Unique identifier for the department.       |
| `name`          | VARCHAR(100) | NOT NULL, UNIQUE       | Name of the department.                     |
| `description`   | TEXT         | NULL                   | Short description of the department.        |
| `is_active`     | BOOLEAN      | NOT NULL, DEFAULT TRUE | Indicates whether the department is active. |

### Primary Key

* `department_id`

### Relationships

* One **Department** can have many **Doctors**.
* One **Doctor** belongs to one **Department**.

### Constraints

- `department_id` → Primary Key
- `name` → Required and unique.
- `description` → Optional.
- `is_active` → Defaults to `TRUE`.
- A department cannot be deleted while doctors are assigned to it.

<br>

# 2. Doctor

## Purpose

The **Doctor** table stores the information of doctors working in the hospital. Doctors can log in to the system, manage their daily queue, call the next patient, and mark consultations as completed.

### Columns

| Column | Data Type | Constraints |Description|
| -------| ----------| ------------|----------- |
| `doctor_id`| BIGSERIAL | Primary Key | Unique identifier for the doctor.|
| `doctor_code` | CHAR(2) | NOT NULL, UNIQUE | Unique two-digit code assigned to the doctor and used in queue token generation. |
| `full_name`| VARCHAR(100) | NOT NULL| Full name of the doctor.|
| `email`| VARCHAR(100) | NOT NULL, UNIQUE| Doctor's email address used for login.|
| `password`| VARCHAR(255) | NOT NULL| Encrypted password for authentication.|
| `phone_number` | VARCHAR(15)  | NOT NULL, UNIQUE | Doctor's contact number.|
| `qualification` | VARCHAR(100) | NOT NULL | Doctor's qualification (e.g., MBBS, MD).|
| `department_id` | BIGINT| NOT NULL, Foreign Key  | References the department the doctor belongs to.|
| `is_available`  | BOOLEAN | NOT NULL, DEFAULT TRUE | Indicates whether the doctor is currently available to accept OP appointments. |

### Primary Key

* `doctor_id`

### Foreign Keys

* `department_id` → References `Department(department_id)`

### Relationships

* One **Department** can have many **Doctors**.
* One **Doctor** belongs to one **Department**.
* One **Doctor** can have many **QueueTokens**.

### Constraints

* `doctor_id` → Primary Key.
* `doctor_code` → Required and unique.
* `full_name` → Required.
* `email` → Required and unique.
* `password` → Required.
* `phone_number` → Required and unique.
* `qualification` → Required.
* `department_id` → Required and references the `Department` table.
* `is_available` → Defaults to `TRUE`.

<br>

# 3. Receptionist

## Purpose

The **Receptionist** table stores the information of hospital receptionists. Receptionists can log in to the system, register walk-in patients, book OP appointments on behalf of patients, generate queue tokens, and manage daily appointments.

### Columns

| Column            | Data Type    | Constraints            | Description                                           |
| ----------------- | ------------ | ---------------------- | ----------------------------------------------------- |
| `receptionist_id` | BIGSERIAL    | Primary Key            | Unique identifier for the receptionist.               |
| `full_name`       | VARCHAR(100) | NOT NULL               | Full name of the receptionist.                        |
| `email`           | VARCHAR(100) | NOT NULL, UNIQUE       | Receptionist's email address used for login.          |
| `password`        | VARCHAR(255) | NOT NULL               | Encrypted password for authentication.                |
| `phone_number`    | VARCHAR(15)  | NOT NULL, UNIQUE       | Receptionist's contact number.                        |
| `is_active`       | BOOLEAN      | NOT NULL, DEFAULT TRUE | Indicates whether the receptionist account is active. |

### Primary Key

* `receptionist_id`

### Relationships

* None

### Constraints

* `receptionist_id` → Primary Key.
* `full_name` → Required.
* `email` → Required and unique.
* `password` → Required.
* `phone_number` → Required and unique.
* `is_active` → Defaults to `TRUE`.

<br>

# 4. Administrator

## Purpose

The **Administrator** table stores the information of hospital administrators. Administrators can log in to the system, manage doctors, departments, and monitor the overall operation of the MediQue system.

### Columns

| Column| Data Type| Constraints| Description|
| ------| ---------| ---------- | ---------- |
| `administrator_id` | BIGSERIAL    | Primary Key            | Unique identifier for the administrator.               |
| `full_name`        | VARCHAR(100) | NOT NULL               | Full name of the administrator.                        |
| `email`            | VARCHAR(100) | NOT NULL, UNIQUE       | Administrator's email address used for login.          |
| `password`         | VARCHAR(255) | NOT NULL               | Encrypted password for authentication.                 |
| `phone_number`     | VARCHAR(15)  | NOT NULL, UNIQUE       | Administrator's contact number.                        |
| `is_active`        | BOOLEAN      | NOT NULL, DEFAULT TRUE | Indicates whether the administrator account is active. |

### Primary Key

* `administrator_id`

### Relationships

* None

### Constraints

* `administrator_id` → Primary Key.
* `full_name` → Required.
* `email` → Required and unique.
* `password` → Required.
* `phone_number` → Required and unique.
* `is_active` → Defaults to `TRUE`.

<br>

# 5. Patient

## Purpose

The **Patient** table stores the information of patients booking OP appointments. Patients do not require an account to use the system. Their information is used to identify them, generate queue tokens, and maintain their booking history.

### Columns

| Column| Data Type| Constraints| Description|
| ------| ---------| -----------| -----------|
| `patient_id`    | BIGSERIAL    | Primary Key      | Unique identifier for the patient. |
| `full_name`     | VARCHAR(100) | NOT NULL         | Full name of the patient.          |
| `date_of_birth` | DATE         | NOT NULL         | Patient's date of birth.           |
| `gender`        | ENUM  | NOT NULL| Patient's gender.|
| `phone_number`  | VARCHAR(15)  | NOT NULL, | Patient's contact number.          |

### Primary Key

* `patient_id`

### Relationships

* One **Patient** can have many **QueueTokens**.

### Constraints

* `patient_id` → Primary Key.
* `full_name` → Required.
* `date_of_birth` → Required.
* `gender` → Required and must be one of: `MALE`, `FEMALE`, `OTHER`.
* `phone_number` → Required.
* The combination of `full_name`, `date_of_birth`, and `phone_number` must be unique.

<br>

# 6. QueueToken

## Purpose

The **QueueToken** table stores the OP booking details for each patient. It represents a patient's place in a doctor's queue and is used to manage queue tracking, consultation status, and real-time queue updates.

### Columns

| Column| Data Type| Constraints| Description|
| ------| ---------| -----------| ---------- |
| `queue_token_id` | BIGSERIAL   | Primary Key| Unique identifier for the queue token.|
| `token_number`| VARCHAR(10) | NOT NULL, UNIQUE| Queue token generated using the doctor's unique two-digit code followed by the daily queue sequence (e.g., `01001`, where `01` is the doctor code and `001` is the daily queue number).|
| `patient_id`     | BIGINT      | NOT NULL, Foreign Key | References the patient who booked the OP.                                                          |
| `doctor_id`      | BIGINT      | NOT NULL, Foreign Key | References the doctor assigned to the queue.                                                       |
| `status`         | ENUM        | NOT NULL              | Current queue status (`WAITING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`).                         |
| `booking_date`   | DATE        | NOT NULL              | Date on which the OP appointment was booked.                                                       |
| `booked_at`      | TIMESTAMP   | NOT NULL              | Date and time when the queue token was generated.                                                  |

### Primary Key

* `queue_token_id`

### Foreign Keys

* `patient_id` → References `Patient(patient_id)`
* `doctor_id` → References `Doctor(doctor_id)`

### Relationships

* One **Patient** can have many **QueueTokens**.
* One **Doctor** can have many **QueueTokens**.

### Constraints

* `queue_token_id` → Primary Key.
* `token_number` → Required and unique within a given `booking_date`.
* `patient_id` → Required and references the `Patient` table.
* `doctor_id` → Required and references the `Doctor` table.
* `status` → Required and must be one of: `WAITING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`.
* `booking_date` → Required.
* `booked_at` → Required.
* Queue numbers reset daily for each doctor.
