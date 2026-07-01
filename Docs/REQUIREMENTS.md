# Requirements

## 1. Stakeholders
Stakeholders are the individuals or groups who interact with or are affected by the MediQue system.

| Stakeholder | Description |
| :---------- | :---------- | 
| **Patients** | Book appointments, receive queue tokens, track their queue status, and view estimated waiting times. | 
| **Doctors** | View their daily appointment queue, call the next patient, mark consultations as completed, and manage their availability. | 
| **Receptionists** | Schedule appointments, generate queue tokens, and assist with queue management. | 
| **Hospital Administrators** | Manage doctors, departments, and monitor overall hospital operations through the admin dashboard. | 


## 2. Functional Requirements
### 2.1  🔐 Authentication

| ID | Requirement |
|----|-------------|
|FR-1.1|The system shall allow registration of the first administrator if no administrator account exists.|
| FR-1.2 | The system shall allow hospital administrators to create accounts for doctors and receptionists. |
| FR-1.3 | The system shall allow hospital staff to log in using their email and password. |
| FR-1.4 | The system shall authenticate users using JWT-based authentication. |
| FR-1.5 | The system shall restrict access to resources based on user roles. |
| FR-1.6 | The system shall allow authenticated users to securely log out. |


### 2.2  👤 Patient Management

| ID | Requirement |
|----|-------------|
| FR-2.1 | The system shall allow patients to book OP appointments without creating an account. | 
| FR-2.2 | The system shall collect the required patient information during appointment booking. | 
| FR-2.3 | The system shall generate a queue token after a successful appointment booking. | 
| FR-2.4 | The system shall allow patients to track their queue status using their queue token. | 
| FR-2.5 | The system shall display the patient's current queue position and estimated waiting time. |

### 2.3 👨‍⚕️ Doctor Management

| ID | Requirement |
|----|-------------|
| FR-3.1 | The system shall allow doctors to view their daily appointment queue. |
| FR-3.2 | The system shall allow doctors to call the next patient in the queue. |
| FR-3.3 | The system shall allow doctors to mark a consultation as completed. |
| FR-3.4 | The system shall automatically update the queue after each completed consultation. |
| FR-3.5 | The system shall allow doctors to update their availability status. |

### 2.4  👩‍💼 Receptionist Management

| ID | Requirement |
|----|-------------|
| FR-4.1 | The system shall allow receptionists to register walk-in patients who are unable to book appointments online. |
| FR-4.2 | The system shall allow receptionists to book appointments on behalf of patients. |
| FR-4.3 | The system shall generate a queue token for appointments booked by the receptionist. |
| FR-4.4 | The system shall allow receptionists to view the daily appointment queue. |
| FR-4.5 | The system shall allow receptionists to update or cancel appointments when required. |

### 2.5 🏥 Hospital Administration

| ID | Requirement |
|----|-------------|
| FR-5.1 | The system shall allow administrators to manage doctor accounts. |
| FR-5.2 | The system shall allow administrators to manage departments. |
| FR-5.3 | The system shall allow administrators to activate or deactivate doctors. |
| FR-5.4 |The system shall allow administrators to monitor appointments and queue status.|

### 2.6 📋 Queue Management

| ID | Requirement |
|----|-------------|
| FR-6.1 | The system shall assign queue numbers sequentially. |
| FR-6.2 | The system shall update queue positions in real time. |
| FR-6.3 | The system shall display the currently serving patient. |
| FR-6.4 | The system shall display the next patients in the queue. |
| FR-6.5 | The system shall recalculate estimated waiting times whenever the queue changes. |

## 3. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1.1 | The system shall provide a responsive user interface that works on desktop, tablet, and mobile devices. |
| NFR-1.2 | The system shall authenticate hospital staff using secure JWT-based authentication. |
| NFR-1.3 | The system shall encrypt user passwords before storing them in the database. |
| NFR-1.4 | The system shall respond to user requests within 2 seconds under normal operating conditions. |
| NFR-1.5 | The system shall maintain data consistency when multiple users access the queue simultaneously. |
| NFR-1.6 | The system shall validate all user inputs before processing them. |
| NFR-1.7 | The system shall log system errors for troubleshooting and maintenance. |
| NFR-1.8 | The system shall provide a user-friendly interface with clear navigation and readable content. |
| NFR-1.9 | The system shall be designed with a modular architecture to support future enhancements. |
| NFR-1.10 | The system shall be compatible with the latest versions of major web browsers such as Chrome, Edge, and Firefox. |


## 4. Business Rules

| ID | Rule |
|----|------|
| BR-1.1 | Each patient shall receive a unique queue token for every confirmed OP appointment. |
|BR-1.2 | A patient shall have only one active queue token (WAITING or IN_PROGRESS) at a time.|
| BR-1.3 | Queue tokens shall be assigned in sequential order. |
| BR-1.4 | Doctors shall call patients in the order of their queue tokens. |
| BR-1.5 | A completed consultation shall remove the patient from the active queue. |
| BR-1.6 | Only authenticated hospital staff shall have access to the management dashboard. |
| BR-1.7 | Queue information shall be updated immediately after a patient is called or a consultation is completed. |
| BR-1.8 | Walk-in patients and online bookings shall be managed within the same queue. |
| BR-1.9| A patient shall be identified by the combination of **full name, date of birth, and phone number**. If an existing patient record matches all three values, the system shall reuse the existing record; otherwise, a new patient record shall be created. |
| BR-1.10| A patient may cancel an OP appointment only while the queue token status is **WAITING**.|
| BR-1.11 | Doctors marked as unavailable shall not accept new OP bookings.|
| BR-1.12 | Queue token numbers shall reset at the beginning of each day.|
| BR-1.13| Patients shall select a department before choosing a doctor for OP booking.|
| BR-1.14 | Staff accounts shall be created only by hospital administrators. Public staff registration shall not be allowed.|
| BR-1.15 | Authorized hospital staff may update patient information, such as phone number, when required. |
| BR-1.16 | If a patient's full name and date of birth match an existing record but the phone number differs, the patient's identity shall be verified by receptionist before updating the existing phone number. |
|BR-1.17|The system shall allow registration of only the first administrator. Once an administrator account has been created, additional administrator registrations shall not be permitted.|


## 5. Assumptions

| ID | Assumption |
|----|------------|
| A-1.1 | Patients provide accurate personal information while booking an OP appointment. |
| A-1.2 | Hospital staff have valid accounts to access the management dashboard. |
| A-1.3 | Doctors update the consultation status after attending each patient. |
| A-1.4 | The hospital has a stable internet connection during system operation. |
| A-1.5 | Patients arrive at the hospital before or around their scheduled appointment time. |
| A-1.6 | Hospital staff use the system according to the defined workflow. |
| A-1.7 | The server and database remain available during normal operating hours. |


## 6. Constraints

| ID | Constraint |
|----|------------|
| C-1.1 | The system shall be developed as a web application. |
| C-1.2 | The backend shall be implemented using Spring Boot. |
| C-1.3 | The frontend shall be implemented using React. |
| C-1.4 | The database shall use PostgreSQL. |
| C-1.5 | Authentication for hospital staff shall use JWT-based authentication. |
| C-1.6 | Patients shall not be required to create an account to book an OP appointment. |
| C-1.7 | The initial version of the system shall support a single hospital. |


## 7. Scope

### In Scope

* Allow patients to book OP appointments without creating an account.
* Generate a unique queue token for every confirmed appointment.
* Display the patient's current queue position and estimated waiting time.
* Allow doctors to view their daily appointment queue.
* Allow doctors to call the next patient and mark consultations as completed.
* Allow receptionists to register walk-in patients and book appointments on their behalf.
* Allow receptionists to manage daily appointments.
* Allow hospital administrators to manage doctors, departments, and schedules.
* Provide role-based authentication and authorization for hospital staff.
* Maintain a real-time queue for both online and walk-in patients.

### Out of Scope

* Patient account registration and login.
* Online payment for appointments.
* Video consultations.
* Electronic Medical Records (EMR/EHR).
* Integration with third-party hospital management systems.
* Multi-hospital support.
