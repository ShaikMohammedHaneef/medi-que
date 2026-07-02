# API Specification

## Overview

This document provides the detailed specification for every REST API used in the MediQue Hospital Outpatient (OP) Queue Management System.

Each API specification includes the endpoint, authentication requirements, request parameters, expected responses, business rules, and implementation notes. This document serves as the primary reference during backend development and testing.


# 1. Authentication APIs

## 1.1 Register First Administrator

### Purpose

Registers the first administrator of the MediQue system. This endpoint is available only if no administrator account exists.

### Endpoint

| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | `/auth/register-admin` |
| Authentication | Not Required |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullName | String | Yes | Administrator's full name. |
| email | String | Yes | Email address used for login. |
| password | String | Yes | Account password. |
| phoneNumber | String | Yes | Contact number. |

### Success Response

| Status | Description |
|--------|-------------|
| 201 Created | Administrator account created successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Invalid request data. |
| 409 Conflict | Administrator already exists or email already exists. |

### Business Rules

- Only one administrator can exist.
- Registration is allowed only when no administrator account exists.
- Password must be stored in encrypted form.

### Notes

- This endpoint becomes unavailable after successful administrator registration.


## 1.2 Staff Login

### Purpose

Authenticates a hospital staff member and returns a JWT access token for accessing protected resources.

### Endpoint

| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | `/auth/login` |
| Authentication | Not Required |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | Yes | Registered email address of the staff member. |
| password | String | Yes | Account password. |

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Authentication successful. JWT access token generated. |

### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Invalid request data. |
| 401 Unauthorized | Invalid email or password. |
| 403 Forbidden | Account is inactive. |

### Business Rules

- Only registered hospital staff can log in.
- Authentication shall be performed using the registered email and password.
- A JWT access token shall be generated upon successful authentication.
- The authenticated user's role determines the resources they are authorized to access.

### Notes

- The access token must be included in the `Authorization` header for all protected endpoints.
- Patients do not use this endpoint because they do not require an account.


## 1.3 Staff Logout

### Purpose

Logs out the authenticated hospital staff member from the system.

### Endpoint

| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | `/auth/logout` |
| Authentication | Required |

### Request Body

No request body is required.

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Logout successful. |

### Error Responses

| Status | Description |
|--------|-------------|
| 401 Unauthorized | Missing or invalid JWT access token. |

### Business Rules

- Only authenticated hospital staff can access this endpoint.
- The client application shall discard the JWT access token after logout.
- The user must authenticate again to access protected resources.

### Notes

- MediQue uses stateless JWT authentication; therefore, the server does not maintain user sessions.
- Logout is handled by the client removing the stored JWT access token.



# 2. Patient

## 2.1 Get Active Departments

### Purpose

Retrieves all active hospital departments available for OP appointment booking.

### Endpoint

| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | `/patients/departments` |
| Authentication | Not Required |

### Request

No request body or parameters are required.

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Active departments retrieved successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 500 Internal Server Error | Unable to retrieve departments. |

### Business Rules

- Only active departments shall be returned.
- Departments marked as inactive shall not be visible to patients.

### Notes

- This endpoint is used to populate the department selection during appointment booking.


## 2.2 Get Available Doctors

### Purpose

Retrieves all active and currently available doctors belonging to the selected department.

### Endpoint

| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | `/patients/departments/{departmentId}/doctors` |
| Authentication | Not Required |

### Request

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `departmentId` | Long | Unique identifier of the department. |

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Doctors retrieved successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 404 Not Found | Department not found. |
| 500 Internal Server Error | Unable to retrieve doctors. |

### Business Rules

- Only doctors belonging to the selected department shall be returned.
- Only active doctors marked as available shall be returned.

### Notes

- This endpoint is called after the patient selects a department.


## 2.3 Book Appointment

### Purpose

Books an OP appointment for a patient and generates a queue token.

### Endpoint

| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | `/patients/book` |
| Authentication | Not Required |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullName | String | Yes | Patient's full name. |
| dateOfBirth | Date | Yes | Patient's date of birth. |
| gender | Enum | Yes | Patient's gender. |
| phoneNumber | String | Yes | Patient's contact number. |
| doctorId | Long | Yes | Selected doctor. |

### Success Response

| Status | Description |
|--------|-------------|
| 201 Created | Appointment booked and queue token generated successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Invalid request data. |
| 404 Not Found | Selected doctor not found. |
| 409 Conflict | Patient already has an active appointment. |
| 500 Internal Server Error | Unable to book appointment. |

### Business Rules

- A patient may have only one active appointment at a time.
- Existing patient records shall be reused if the patient's full name, date of birth, and phone number match.
- If the full name and date of birth match an existing patient but the phone number differs, identity verification shall be performed before updating the phone number.
- A unique queue token shall be generated upon successful booking.
- Queue numbers shall be assigned sequentially.
- Appointments can only be booked with doctors who are currently available.

### Notes

- Queue position and estimated waiting time are calculated dynamically and are not stored in the database.


## 2.4 Track Queue

### Purpose

Retrieves the current queue status for a patient using the queue token number.

### Endpoint

| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | `/patients/track/{tokenNumber}` |
| Authentication | Not Required |

### Request

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `tokenNumber` | String | Queue token assigned during appointment booking. |

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Queue information retrieved successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 404 Not Found | Queue token not found. |
| 500 Internal Server Error | Unable to retrieve queue information. |

### Business Rules

- Queue position shall be calculated dynamically.
- Estimated waiting time shall be calculated dynamically.
- Queue information shall always reflect the latest queue status.

### Notes

- This endpoint retrieves the initial queue information for the specified queue token.
- The doctor code is extracted from the queue token.
- Clients should subscribe to `/topic/queue/{doctorCode}` to receive real-time queue updates.


## 2.5 Cancel Appointment

### Purpose

Cancels a patient's OP appointment.

### Endpoint

| Property | Value |
|----------|-------|
| Method | PATCH |
| Endpoint | `/patients/cancel/{tokenNumber}` |
| Authentication | Not Required |

### Request

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `tokenNumber` | String | Queue token assigned during appointment booking. |

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Appointment cancelled successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Appointment cannot be cancelled. |
| 404 Not Found | Queue token not found. |
| 500 Internal Server Error | Unable to cancel appointment. |

### Business Rules

- Only appointments with a status of `WAITING` can be cancelled.
- Cancelled appointments shall be removed from the active queue.
- Queue positions and estimated waiting times shall be recalculated after cancellation.

### Notes

- Patients do not require authentication to cancel appointments but must provide a valid queue token.


# 3. Doctor

## 3.1 View Daily Queue

### Purpose

Retrieves the authenticated doctor's daily appointment queue.

### Endpoint

| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | `/doctors/queue` |
| Authentication | Required |

### Request

No request body or parameters are required.

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Doctor's daily queue retrieved successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 500 Internal Server Error | Unable to retrieve the queue. |

### Business Rules

- Doctors can view only their own daily queue.
- The authenticated doctor's identity shall be obtained from the JWT access token.
- The queue shall include all appointments for the current day.
- Queue entries shall be displayed in queue token order.

### Notes

- The frontend receives real-time queue updates through WebSocket events.


## 3.2 Call Next Patient

### Purpose

Calls the next waiting patient in the authenticated doctor's queue.

### Endpoint

| Property | Value |
|----------|-------|
| Method | PATCH |
| Endpoint | `/doctors/next` |
| Authentication | Required |

### Request

No request body is required.

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Next patient called successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | No waiting patients available in the queue. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 500 Internal Server Error | Unable to call the next patient. |

### Business Rules

- Only the authenticated doctor can call the next patient in their queue.
- The next patient shall be selected based on the lowest queue token with a status of `WAITING`.
- The selected patient's status shall change from `WAITING` to `IN_PROGRESS`.
- Queue updates shall be broadcast through WebSocket.

### Notes

- Only one patient can have the status `IN_PROGRESS` for a doctor at any given time.


## 3.3 Complete Consultation

### Purpose

Marks the current consultation as completed.

### Endpoint

| Property | Value |
|----------|-------|
| Method | PATCH |
| Endpoint | `/doctors/complete` |
| Authentication | Required |

### Request

No request body is required.

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Consultation completed successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | No consultation is currently in progress. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 500 Internal Server Error | Unable to complete the consultation. |

### Business Rules

- Only the authenticated doctor can complete consultations in their queue.
- The consultation currently marked as `IN_PROGRESS` shall be updated to `COMPLETED`.
- Queue positions and estimated waiting times shall be recalculated.
- Queue updates shall be broadcast through WebSocket.

### Notes

- After completion, the doctor can call the next patient using the **Call Next Patient** endpoint.


## 3.4 Update Availability

### Purpose

Updates the authenticated doctor's availability for accepting new OP appointments.

### Endpoint

| Property | Value |
|----------|-------|
| Method | PATCH |
| Endpoint | `/doctors/availability` |
| Authentication | Required |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| isAvailable | Boolean | Yes | Indicates whether the doctor is accepting new OP appointments. |

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Doctor availability updated successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Invalid request data. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 500 Internal Server Error | Unable to update availability. |

### Business Rules

- Doctors can update only their own availability.
- The authenticated doctor's identity shall be obtained from the JWT access token.
- Doctors marked as unavailable shall not accept new OP appointments.
- Existing appointments shall not be affected when availability is updated.

### Notes

- Patients can book appointments only with doctors who are currently marked as available.


# 4. Receptionist

## 4.1 Book Walk-in Appointment

### Purpose

Registers a walk-in patient and books an OP appointment on the patient's behalf.

### Endpoint

| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | `/receptionists/book` |
| Authentication | Required |

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullName | String | Yes | Patient's full name. |
| dateOfBirth | Date | Yes | Patient's date of birth. |
| gender | Enum | Yes | Patient's gender. |
| phoneNumber | String | Yes | Patient's contact number. |
| doctorId | Long | Yes | Selected doctor. |

### Success Response

| Status | Description |
|--------|-------------|
| 201 Created | Appointment booked and queue token generated successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Invalid request data. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 404 Not Found | Selected doctor not found. |
| 409 Conflict | Patient already has an active appointment. |
| 500 Internal Server Error | Unable to book appointment. |

### Business Rules

- Only authenticated receptionists can access this endpoint.
- Existing patient records shall be reused if the patient's full name, date of birth, and phone number match.
- If the full name and date of birth match an existing patient but the phone number differs, the receptionist shall verify the patient's identity before updating the phone number.
- A patient may have only one active appointment at a time.
- A unique queue token shall be generated upon successful booking.
- Queue numbers shall be assigned sequentially.
- Appointments can only be booked with doctors who are currently available.

### Notes

- Receptionists use the patient department and doctor lookup APIs when booking appointments.
- Queue position and estimated waiting time are calculated dynamically.


## 4.2 View Doctor Queue

### Purpose

Retrieves the daily appointment queue for the selected doctor.

### Endpoint

| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | `/receptionists/queue/{doctorCode}` |
| Authentication | Required |

### Request

#### Path Parameters

| Parameter    | Type   | Description                         |
| ------------ | ------ | ----------------------------------- |
| `doctorCode` | String | Unique code of the selected doctor. |

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Queue retrieved successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 404 Not Found | Doctor not found. |
| 500 Internal Server Error | Unable to retrieve the queue. |

### Business Rules

- Only authenticated receptionists can access this endpoint.
- The queue shall include all appointments for the selected doctor on the current day.
- Queue entries shall be displayed in queue token order.

### Notes

- Receptionists can view the queue of any doctor.


## 4.3 Cancel Appointment

### Purpose

Cancels a patient's OP appointment.

### Endpoint

| Property | Value |
|----------|-------|
| Method | PATCH |
| Endpoint | `/receptionists/cancel/{tokenNumber}` |
| Authentication | Required |

### Request

#### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| tokenNumber | String | Queue token assigned to the appointment. |

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Appointment cancelled successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Appointment cannot be cancelled. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 404 Not Found | Queue token not found. |
| 500 Internal Server Error | Unable to cancel the appointment. |

### Business Rules

- Only authenticated receptionists can access this endpoint.
- Only appointments with a status of `WAITING` can be cancelled.
- Cancelled appointments shall be removed from the active queue.
- Queue positions and estimated waiting times shall be recalculated.
- Queue updates shall be broadcast through WebSocket.

### Notes

- Receptionists can cancel appointments on behalf of patients.

# 5. Administrator

## 5.1 Dashboard Statistics

### Purpose

Retrieves an overview of the hospital's current OP queue and system statistics for display on the administrator dashboard.

### Endpoint

| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | `/admin/dashboard` |
| Authentication | Required |

### Request

No request body or parameters are required.

### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Dashboard statistics retrieved successfully. |

### Error Responses

| Status | Description |
|--------|-------------|
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 500 Internal Server Error | Unable to retrieve dashboard statistics. |

### Business Rules

- Only authenticated administrators can access this endpoint.
- The dashboard shall display real-time system statistics.
- Statistics shall include information for the current day only.

### Notes

The dashboard includes the following statistics for the current day:

- Total appointments booked today.
- Total appointments completed today.
- Total appointments waiting.
- Total appointments currently in progress.
- Total cancelled appointments.
- Total active doctors.
- Total active receptionists.
- Total active departments.

## 5.2 Department Management

### 5.2.1 Get Departments

#### Purpose

Retrieves all hospital departments, including both active and inactive departments.

#### Endpoint

| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | `/admin/departments` |
| Authentication | Required |

#### Request

No request body or parameters are required.

#### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Departments retrieved successfully. |

#### Error Responses

| Status | Description |
|--------|-------------|
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 500 Internal Server Error | Unable to retrieve departments. |

#### Business Rules

- Only authenticated administrators can access this endpoint.
- Both active and inactive departments shall be returned.

#### Notes

- This endpoint is intended for department management.


### 5.2.2 Create Department

#### Purpose

Creates a new hospital department.

#### Endpoint

| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | `/admin/departments` |
| Authentication | Required |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Name of the department. |
| description | String | No | Short description of the department. |

#### Success Response

| Status | Description |
|--------|-------------|
| 201 Created | Department created successfully. |

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Invalid request data. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 409 Conflict | Department already exists. |
| 500 Internal Server Error | Unable to create department. |

#### Business Rules

- Only authenticated administrators can create departments.
- Department names shall be unique.
- Newly created departments shall be active by default.

#### Notes

- Departments become available for patient booking immediately after creation.


### 5.2.3 Update Department

#### Purpose

Updates the details of an existing department.

#### Endpoint

| Property | Value |
|----------|-------|
| Method | PUT |
| Endpoint | `/admin/departments/{departmentId}` |
| Authentication | Required |

#### Request

##### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| departmentId | Long | Unique identifier of the department. |

##### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Updated department name. |
| description | String | No | Updated department description. |

#### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Department updated successfully. |

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Invalid request data. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 404 Not Found | Department not found. |
| 409 Conflict | Department name already exists. |
| 500 Internal Server Error | Unable to update department. |

#### Business Rules

- Only authenticated administrators can update departments.
- Department names shall remain unique.

#### Notes

- Updating a department does not affect existing appointments.


### 5.2.4 Deactivate Department

#### Purpose

Marks a department as inactive.

#### Endpoint

| Property | Value |
|----------|-------|
| Method | PATCH |
| Endpoint | `/admin/departments/{departmentId}/deactivate` |
| Authentication | Required |

#### Request

##### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| departmentId | Long | Unique identifier of the department. |

#### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Department deactivated successfully. |

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Department cannot be deactivated. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 404 Not Found | Department not found. |
| 500 Internal Server Error | Unable to deactivate department. |

#### Business Rules

- Only authenticated administrators can deactivate departments.
- Inactive departments shall not be available for new OP bookings.
- A department cannot be deactivated while active doctors are assigned to it.

#### Notes

- Deactivation changes the department's status instead of deleting the record.

## 5.3 Doctor Management

### 5.3.1 Get Doctors

#### Purpose

Retrieves all doctors, including both active and inactive doctors.

#### Endpoint

| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | `/admin/doctors` |
| Authentication | Required |

#### Request

No request body or parameters are required.

#### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Doctors retrieved successfully. |

#### Error Responses

| Status | Description |
|--------|-------------|
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 500 Internal Server Error | Unable to retrieve doctors. |

#### Business Rules

- Only authenticated administrators can access this endpoint.
- Both active and inactive doctors shall be returned.

#### Notes

- This endpoint is intended for doctor management.


### 5.3.2 Create Doctor

#### Purpose

Creates a new doctor account.

#### Endpoint

| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | `/admin/doctors` |
| Authentication | Required |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| doctorCode | String | Yes | Unique two-digit doctor code. |
| fullName | String | Yes | Doctor's full name. |
| email | String | Yes | Email address used for login. |
| password | String | Yes | Account password. |
| phoneNumber | String | Yes | Contact number. |
| qualification | String | Yes | Doctor's qualification. |
| departmentId | Long | Yes | Department to which the doctor belongs. |

#### Success Response

| Status | Description |
|--------|-------------|
| 201 Created | Doctor account created successfully. |

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Invalid request data. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 404 Not Found | Department not found. |
| 409 Conflict | Doctor code, email or phone number already exists. |
| 500 Internal Server Error | Unable to create doctor account. |

#### Business Rules

- Only authenticated administrators can create doctor accounts.
- Doctor code shall be unique.
- Email address shall be unique.
- Phone number shall be unique.
- Password shall be stored in encrypted form.
- The specified department must exist.
- Newly created doctors shall be active and available by default.

#### Notes

- Doctor codes are used for queue token generation.
- Doctor accounts can immediately access the system after creation.


### 5.3.3 Update Doctor

#### Purpose

Updates an existing doctor's information.

#### Endpoint

| Property | Value |
|----------|-------|
| Method | PUT |
| Endpoint | `/admin/doctors/{doctorId}` |
| Authentication | Required |

#### Request

##### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| doctorId | Long | Unique identifier of the doctor. |

##### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullName | String | Yes | Doctor's full name. |
| email | String | Yes | Email address. |
| phoneNumber | String | Yes | Contact number. |
| qualification | String | Yes | Doctor's qualification. |
| departmentId | Long | Yes | Assigned department. |
| isAvailable | Boolean | Yes | Indicates whether the doctor is accepting new OP appointments. |

#### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Doctor information updated successfully. |

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Invalid request data. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 404 Not Found | Doctor or department not found. |
| 409 Conflict | Email or phone number already exists. |
| 500 Internal Server Error | Unable to update doctor information. |

#### Business Rules

- Only authenticated administrators can update doctor information.
- Doctor code shall not be modified after account creation.
- Email address shall remain unique.
- Phone number shall remain unique.
- The assigned department must exist.

#### Notes

- Updating doctor information does not affect existing appointments.


### 5.3.4 Deactivate Doctor

#### Purpose

Marks a doctor account as inactive.

#### Endpoint

| Property | Value |
|----------|-------|
| Method | PATCH |
| Endpoint | `/admin/doctors/{doctorId}/deactivate` |
| Authentication | Required |

#### Request

##### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| doctorId | Long | Unique identifier of the doctor. |

#### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Doctor account deactivated successfully. |

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Doctor account cannot be deactivated. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 404 Not Found | Doctor not found. |
| 500 Internal Server Error | Unable to deactivate doctor account. |

#### Business Rules

- Only authenticated administrators can deactivate doctor accounts.
- Inactive doctors shall not be able to log in.
- Inactive doctors shall not accept new OP appointments.

#### Notes

- Deactivation changes the doctor's status instead of deleting the account.

## 5.4 Receptionist Management

### 5.4.1 Get Receptionists

#### Purpose

Retrieves all receptionist accounts, including both active and inactive receptionists.

#### Endpoint

| Property | Value |
|----------|-------|
| Method | GET |
| Endpoint | `/admin/receptionists` |
| Authentication | Required |

#### Request

No request body or parameters are required.

#### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Receptionists retrieved successfully. |

#### Error Responses

| Status | Description |
|--------|-------------|
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 500 Internal Server Error | Unable to retrieve receptionist accounts. |

#### Business Rules

- Only authenticated administrators can access this endpoint.
- Both active and inactive receptionist accounts shall be returned.

#### Notes

- This endpoint is intended for receptionist account management.


### 5.4.2 Create Receptionist

#### Purpose

Creates a new receptionist account.

#### Endpoint

| Property | Value |
|----------|-------|
| Method | POST |
| Endpoint | `/admin/receptionists` |
| Authentication | Required |

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullName | String | Yes | Receptionist's full name. |
| email | String | Yes | Email address used for login. |
| password | String | Yes | Account password. |
| phoneNumber | String | Yes | Contact number. |

#### Success Response

| Status | Description |
|--------|-------------|
| 201 Created | Receptionist account created successfully. |

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Invalid request data. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 409 Conflict | Email or phone number already exists. |
| 500 Internal Server Error | Unable to create receptionist account. |

#### Business Rules

- Only authenticated administrators can create receptionist accounts.
- Email addresses shall be unique.
- Phone numbers shall be unique.
- Passwords shall be stored in encrypted form.
- Newly created receptionist accounts shall be active by default.

#### Notes

- Receptionists can log in immediately after their account is created.


### 5.4.3 Update Receptionist

#### Purpose

Updates an existing receptionist's information.

#### Endpoint

| Property | Value |
|----------|-------|
| Method | PUT |
| Endpoint | `/admin/receptionists/{receptionistId}` |
| Authentication | Required |

#### Request

##### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| receptionistId | Long | Unique identifier of the receptionist. |

##### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| fullName | String | Yes | Receptionist's full name. |
| email | String | Yes | Email address. |
| phoneNumber | String | Yes | Contact number. |

#### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Receptionist information updated successfully. |

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Invalid request data. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 404 Not Found | Receptionist not found. |
| 409 Conflict | Email or phone number already exists. |
| 500 Internal Server Error | Unable to update receptionist information. |

#### Business Rules

- Only authenticated administrators can update receptionist information.
- Email addresses shall remain unique.
- Phone numbers shall remain unique.

#### Notes

- Updating receptionist information does not affect existing appointments or queue data.


### 5.4.4 Deactivate Receptionist

#### Purpose

Marks a receptionist account as inactive.

#### Endpoint

| Property | Value |
|----------|-------|
| Method | PATCH |
| Endpoint | `/admin/receptionists/{receptionistId}/deactivate` |
| Authentication | Required |

#### Request

##### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| receptionistId | Long | Unique identifier of the receptionist. |

#### Success Response

| Status | Description |
|--------|-------------|
| 200 OK | Receptionist account deactivated successfully. |

#### Error Responses

| Status | Description |
|--------|-------------|
| 400 Bad Request | Receptionist account cannot be deactivated. |
| 401 Unauthorized | Missing or invalid JWT access token. |
| 403 Forbidden | User is not authorized to access this resource. |
| 404 Not Found | Receptionist not found. |
| 500 Internal Server Error | Unable to deactivate receptionist account. |

#### Business Rules

- Only authenticated administrators can deactivate receptionist accounts.
- Inactive receptionists shall not be able to log in.

#### Notes

- Deactivation changes the receptionist's status instead of deleting the account.

# 6. WebSocket Events

## Queue Updates

### Endpoint

| Property | Value |
|----------|-------|
| Publish | `/app/queue/update` |
| Subscribe | `/topic/queue/{doctoCode}` |

### Events

- New appointment booked.
- Next patient called.
- Consultation completed.
- Queue position updated.
- Estimated waiting time updated.
- Appointment cancelled.

### Notes

- Queue updates are automatically pushed to subscribed clients.
- Clients do not need to poll the server for queue changes.