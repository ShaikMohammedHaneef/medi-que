# API Documentation

## 1. Overview

This document describes the REST APIs and WebSocket endpoints used in the MediQue Hospital Outpatient (OP) Queue Management System.

The backend follows RESTful principles for request-response operations such as authentication, appointment booking, queue management, and administrative tasks. WebSockets (STOMP) are used to provide real-time queue updates to connected clients whenever the queue changes.

This document defines the available endpoints, authentication requirements, request and response formats, and the purpose of each API.

---

## 2. Base URL

During development, the application's base URL is:

```text
http://localhost:8080/api
```

All REST API endpoints described in this document are relative to this base URL.

---

## 3. Authentication

MediQue uses **JWT (JSON Web Token)** based authentication for hospital staff.

The system supports the following authentication workflow:

- The first administrator registers using the administrator registration endpoint. This endpoint is available only if no administrator account exists.
- After successful registration, the administrator logs in using their email and password.
- The administrator creates accounts for doctors and receptionists.
- Doctors and receptionists authenticate using their assigned credentials.
- Upon successful authentication, the backend returns a JWT access token.
- The access token must be included in the `Authorization` header when accessing protected resources.

Example:

```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

Patients do not require an account or authentication to:

- Book an OP appointment.
- Track their queue status.
- Cancel an appointment while its status is `WAITING`.

---

## 4. API Modules

The MediQue REST APIs are organized into the following modules.

### 4.1 Authentication

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/auth/register-admin` | Register the first administrator. Available only if no administrator account exists. | No |
| POST | `/auth/login` | Authenticate hospital staff and generate a JWT access token. | No |
| POST | `/auth/logout` | Logout the authenticated user. | Yes |

---

### 4.2 Patient

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/patients/book` | Book a new OP appointment and generate a queue token. | No |
| GET | `/patients/track/{tokenNumber}` | Retrieve the current queue status, queue position, and estimated waiting time. | No |
| PATCH | `/patients/cancel/{tokenNumber}` | Cancel an OP appointment while its status is `WAITING`. | No |
| GET    | `/patients/departments` | Retrieve all active departments. | No |
| GET    | `/patients/departments/{departmentId}/doctors` | Retrieve all active & available doctors in the selected department. | No|


---

### 4.3 Doctor

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/doctors/queue` | Retrieve the authenticated doctor's daily queue. | Yes |
| PATCH | `/doctors/next` | Call the next patient in the queue. | Yes |
| PATCH | `/doctors/complete` | Mark the current consultation as completed. | Yes |
| PATCH | `/doctors/availability` | Update the authenticated doctor's availability status. | Yes |

---

### 4.4 Receptionist

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/receptionists/book` | Register a walk-in patient and generate a queue token. | Yes |
| GET | `/receptionists/queue/{doctorId}` | Retrieve the daily queue for a selected doctor. | Yes |
| PATCH | `/receptionists/cancel/{tokenNumber}` | Cancel a patient's OP appointment. | Yes |

---

### 4.5 Administrator

#### Dashboard

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/admin/dashboard` | Retrieve dashboard statistics and queue overview. | Yes |


#### Department

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/admin/departments` | Retrieve all departments(active & inactive). | Yes |
| POST | `/admin/departments` | Create a new department. | Yes |
| PUT | `/admin/departments/{id}` | Update department information. | Yes |
| PATCH | `/admin/departments/{id}/deactivate` | Deactivate a department. | Yes |



#### Doctor

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/admin/doctors` | Retrieve all doctors(active & inactive). | Yes |
| POST | `/admin/doctors` | Create a new doctor account. | Yes |
| PUT | `/admin/doctors/{id}` | Update doctor information. | Yes |
| PATCH | `/admin/doctors/{id}/deactivate` | Deactivate a doctor account. | Yes |

#### Receptionist

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/admin/receptionists` | Retrieve all receptionists(active & inactive). | Yes |
| POST | `/admin/receptionists` | Create a new receptionist account. | Yes |
| PUT | `/admin/receptionists/{id}` | Update receptionist information. | Yes |
| PATCH | `/admin/receptionists/{id}/deactivate` | Deactivate a receptionist account. | Yes |

---

## 5. WebSocket Endpoints

MediQue uses **WebSockets (STOMP)** to broadcast real-time queue updates to connected clients.

| Endpoint | Description |
|----------|-------------|
| `/topic/queue/{doctorCode}` | Broadcasts queue updates for a specific doctor's queue. |
| `/app/queue/update` | Publishes queue update events from the backend. |


Whenever a queue changes, connected clients automatically receive updated queue information without refreshing the page.

Events include:

- New appointment booked.
- Next patient called.
- Consultation completed.
- Queue position updated.
- Estimated waiting time updated.
- Appointment cancelled.


## 6. Notes

- All request and response bodies use JSON format.
- All protected endpoints require a valid JWT access token.
- Patients can book, track, and cancel appointments without creating an account.
- Queue token numbers are unique for a given booking date and reset daily.
- Doctors can manage only their own queues.
- Walk-in patients and online bookings share the same queue.
- Queue updates are delivered in real time using WebSockets.
- All API responses use standard HTTP status codes.
