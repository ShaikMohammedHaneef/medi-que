# PROJECT PLAN


## 1. Project Overview

MediQue is a web-based Hospital Outpatient (OP) Queue Management System designed to eliminate traditional manual queues in hospitals and provide patients with estimated waiting time. Instead of waiting in long physical lines without knowing when they will be called, patients can book an OP appointment, receive a digital queue token, and track their current queue position and estimated waiting time.

The system also provides separate dashboards for doctors, receptionists, and hospital administrators to manage appointments and queues more efficiently. By reducing manual queue management and giving patients a clear idea of their waiting time, MediQue aims to make the outpatient experience more organized, efficient, and convenient for both patients and hospital staff.


## 2. Problem Statement

Many hospitals still manage OP queues manually, causing patients to wait for long periods without knowing when their turn will come. This leads to wasted time, crowded waiting areas, and frustration for patients, while making it harder for hospital staff to manage appointments and queues efficiently.


## 3. Proposed Solution

MediQue solves this problem by replacing manual queues with a digital queue management system. Patients can book an OP appointment, receive a queue token, and check their current queue position and estimated waiting time in real time. This helps reduce unnecessary waiting, makes queue management easier for hospital staff, and provides a smoother experience for both patients and hospitals.


## 4. Project Objectives

* Eliminate the need for manual queues in hospital outpatient departments.
* Help patients know their estimated waiting time before their turn.
* Make appointment booking and queue management simple for both patients and hospital staff.
* Provide a real-time view of the patient queue for doctors and receptionists.
*Create a more organized and transparent outpatient management system.


## 5. Core Features

High-level feature list.

* Online OP Appointment Booking
* Queue Token Generation
* Live Queue Tracking with Estimated Waiting Time
* Doctor Dashboard
* Receptionist Dashboard
* Admin Dashboard
* Role-Based Authentication
* Real-time queue updates using WebSockets.


## 6. Technology Stack

### Frontend

* React
* Tailwind CSS
* Axios

### Backend

* Java
* Spring Boot
* Spring Security
* JWT
* WebSocket (STOMP)

### Database

* PostgreSQL

### Tools

* Git
* GitHub
* Postman
* IntelliJ IDEA
* VS Code


## 7. System Architecture

MediQue follows a three-tier architecture consisting of the presentation layer, application layer, and database layer.

* **Presentation Layer:** Built using React, it provides separate interfaces for patients, doctors, receptionists, and hospital administrators.
* **Application Layer:** Built using Spring Boot, it handles business logic, authentication, appointment management, and queue management through REST APIs.
* **Database Layer:** PostgreSQL is used to store and manage application data, including appointments, queue information, users, and departments.

### Architecture Flow

```text
Users
   │
   ▼
React Frontend
   │
REST API (HTTP)
   │
Spring Boot Backend
   │
Spring Data JPA
   │
PostgreSQL Database
```
<br>

> **Note:** For a detailed representation of the system architecture, refer to [`docs/diagrams/architecture-diagram.png`](docs/diagrams/architecture-diagram.png).


## 8. Database Design Overview

### Main Entities

* Patient
* Appointment
* Queue
* Doctor
* Receptionist
* Hospital Administrator
* Department


> **Note:** For a detailed database design, including the Entity Relationship (ER) Diagram, table structure, and database schema, refer to the [`database/`](database/).

## 9. Development Roadmap

### Phase 1: Project Planning

* Define project requirements.
* Create project documentation.
* Set up the GitHub repository.

### Phase 2: System Design

* Design the database.
* Create architecture and UML diagrams.
* Design REST APIs.

### Phase 3: Backend Development

* Set up the Spring Boot project.
* Implement authentication and authorization.
* Develop appointment and queue management modules.
* Develop doctor, receptionist, and administrator modules.

### Phase 4: Frontend Development

* Set up the React project.
* Develop user interfaces for patients and hospital staff.
* Integrate the frontend with backend APIs.

### Phase 5: Testing & Deployment

* Perform application testing.
* Fix bugs and improve performance.
* Deploy the application.

## 10. Future Enhancements

The following features are not included in the initial version of MediQue but may be considered for future releases:

* Email/SMS notifications
* Online payments
* Mobile application
* Multi-hospital support
