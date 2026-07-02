# System Architecture

![MediQue System Architecture](architecture-diagram.png)

## 1. Overview

MediQue follows a three-tier architecture consisting of the Presentation Layer, Application Layer, and Database Layer. The application is built using React for the frontend, Spring Boot for the backend, and PostgreSQL as the database.

The system uses **REST APIs** for standard request-response operations such as authentication, appointment booking, and data retrieval. **WebSockets (STOMP)** are used to provide real-time queue updates, allowing patients and hospital staff to receive the latest queue information instantly without refreshing the page.


## 2. Architecture Layers

### Presentation Layer (React)

The Presentation Layer provides separate user interfaces for different users of the system.

**User Interfaces**

* Patient UI
* Doctor UI
* Receptionist UI
* Hospital Administrator UI

**Responsibilities**

* Display application screens.
* Send requests to the backend using REST APIs.
* Receive real-time queue updates through WebSockets.
* Display queue position and estimated waiting time.

---

### Application Layer (Spring Boot)

The Application Layer contains the application's business logic and handles all client requests.

#### Security

Authentication and authorization are implemented using **Spring Security** and **JWT (JSON Web Token)** to ensure that only authorized hospital staff can access protected resources.

#### Controllers

Controllers receive incoming HTTP requests from the frontend, validate the requests, and delegate the business logic to the appropriate service.

#### Service Layer

The Service Layer contains the core business logic of the application.

**Services**

* Authentication Service
* Appointment Service
* Doctor Service
* Receptionist Service
* Hospital Administrator Service
* Queue Service
* SMS Service

The Queue Service manages the patient queue and broadcasts real-time queue updates through WebSockets whenever the queue status changes.

#### Repository Layer

Repositories provide access to the database using **Spring Data JPA**, allowing the application to perform CRUD operations without writing complex SQL queries.

---

### Database Layer

The Database Layer uses **PostgreSQL** to store and manage the application's data.

The database stores and manages application data, including:

* Patients
* Hospital Staff
* Departments
* Queue Tokens


## 3. Communication Flow

### REST API

REST APIs are used for standard operations such as:

* Staff authentication
* Appointment booking
* Queue management
* Department management
* Viewing queue information and hospital data

---

### WebSocket (STOMP)

WebSockets are used for real-time communication.

Whenever the queue changes, the backend broadcasts the updated queue information to all connected clients.

Examples include:

* Doctor calls the next patient.
* Queue position changes.
* Estimated waiting time changes.
* Current serving token changes.


## 4. Request Flow

### Standard Request

1. A user performs an action from the React application.
2. The request is sent to the Spring Boot backend through a REST API.
3. Spring Security authenticates and authorizes the request.
4. The controller forwards the request to the appropriate service.
5. The service performs the required business logic.
6. The repository interacts with the PostgreSQL database using Spring Data JPA.
7. The backend returns the response to the frontend.

---

### Real-Time Queue Update

1. A doctor calls the next patient.
2. The Queue Service updates the queue information in the database.
3. The Queue Service publishes the latest queue update through the WebSocket module.
4. All connected clients receive the updated queue information instantly.
5. The user interface automatically updates the queue position and estimated waiting time.


## 5. Summary

The architecture of MediQue separates the presentation, application, and database layers to provide a secure, modular, and maintainable system. REST APIs handle standard client-server communication, while WebSockets enable real-time queue updates, ensuring patients and hospital staff always have the latest queue information.