# MediQue
![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.0-green)
![React](https://img.shields.io/badge/React-19-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)

A web-based Hospital Outpatient (OP) Queue Management System that replaces manual hospital queues with a digital queue management system and provides patients with real-time queue tracking and estimated waiting times.


# Project Overview

MediQue is a web-based Hospital Outpatient (OP) Queue Management System designed to eliminate traditional manual queues in hospitals and provide patients with estimated waiting time. Instead of waiting in long physical lines without knowing when they will be called, patients can book an OP appointment, receive a digital queue token, and track their current queue position and estimated waiting time.

The system also provides separate dashboards for doctors, receptionists, and hospital administrators to manage appointments and queues more efficiently. By reducing manual queue management and giving patients a clear idea of their waiting time, MediQue aims to make the outpatient experience more organized, efficient, and convenient for both patients and hospital staff.


# About the Project

Many hospitals still rely on manual queue management, where patients often spend long hours waiting without knowing when their turn will come. This creates overcrowded waiting areas, wastes patients' time, and makes queue management difficult for hospital staff.

MediQue addresses this problem by replacing manual queues with a digital queue management system. Patients can easily book appointments, receive a queue token, and monitor their queue status from anywhere. Doctors and hospital staff can efficiently manage appointments and queues through dedicated dashboards, creating a more organized and transparent outpatient experience.


# Problem Statement

Many hospitals still manage OP queues manually, causing patients to wait for long periods without knowing when their turn will come. This leads to wasted time, crowded waiting areas, and frustration for patients, while making it harder for hospital staff to manage appointments and queues efficiently.


# Features

* Online OP Appointment Booking
* Queue Token Generation
* Live Queue Tracking with Estimated Waiting Time
* Doctor Dashboard
* Receptionist Dashboard
* Admin Dashboard
* Role-Based Authentication and Authorization
* Real-time queue updates using WebSockets.


# Tech Stack

## Frontend

* React
* Tailwind CSS
* Axios

## Backend

* Java
* Spring Boot
* Spring Security
* JWT
* WebSocket (STOMP)

## Database

* PostgreSQL

## Development Tools

* Git
* GitHub
* IntelliJ IDEA
* Visual Studio Code
* Postman


# Project Structure

```text
MediQue/
│
├── backend/
├── frontend/
├── database/
│
├── docs/
│   ├── api/
│   ├── diagrams/
│   ├── screenshots/
│   ├── REQUIREMENTS.md
│   └── architecture.md
│
├── PROJECT_PLAN.md
├── README.md
└── .gitignore
```


# Documentation

Detailed project documentation is available in the `docs/` directory.

- [Requirements Specification](docs/REQUIREMENTS.md)
- [Project Plan](PROJECT_PLAN.md)
- [System Architecture](docs/architecture.md)
- [Database Design](database/README.md)
- [API Documentation](docs/api/api.md)


# Installation

## Prerequisites

Make sure the following software is installed on your system:

* Java JDK 21
* PostgreSQL
* Git

The project includes the **Maven Wrapper**, so no need to install Maven separately.

## Clone the Repository

Clone the MediQue repository:

```bash
git clone <repository-url>
cd medi-que
```

## Database Setup

MediQue uses PostgreSQL as its database.

Create the database:

```sql
CREATE DATABASE medique_db;
```

If you use a different database name, update the PostgreSQL connection URL accordingly.

The database schema is available at:
[`database/schema.sql`](database/schema.sql)

Execute `schema.sql` against your PostgreSQL database before starting the application.

> **Important:** `spring.jpa.hibernate.ddl-auto=none` is configured in the application. Hibernate will not automatically create or modify the database tables.

# Configuration

MediQue uses environment variables for database credentials, administrator details, and JWT configuration.

The default `application.properties` contains:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

admin.full-name=${ADMIN_FULL_NAME}
admin.email=${ADMIN_EMAIL}
admin.password=${ADMIN_PASSWORD}
admin.phone-number=${ADMIN_PHONE}

jwt.secret=${JWT_SECRET}
jwt.expiration=${JWT_EXPIRATION}
```

Before running the application, configure these values using one of the following approaches.

## Option 1: Environment Variables

**Recommended for normal development.**

Configure the following environment variables:

| Variable          | Description                          | Example                                       |
| ----------------- | ------------------------------------ |-----------------------------------------------|
| `DB_URL`          | PostgreSQL JDBC connection URL       | `jdbc:postgresql://localhost:5432/medique_db` |
| `DB_USERNAME`     | PostgreSQL username                  | `postgres`                                    |
| `DB_PASSWORD`     | PostgreSQL password                  | `your_database_password`                      |
| `ADMIN_FULL_NAME` | Initial administrator's full name    | `System Administrator`                        |
| `ADMIN_EMAIL`     | Initial administrator's email        | `admin@example.com`                           |
| `ADMIN_PASSWORD`  | Initial administrator's password     | `your_admin_password`                         |
| `ADMIN_PHONE`     | Initial administrator's phone number | `9999999999`                                  |
| `JWT_SECRET`      | Secret key used to sign JWTs         | `your_secure_jwt_secret`                      |
| `JWT_EXPIRATION`  | JWT access token expiration duration | `3600000`                                     |

Set these variables according to your local environment.

## Option 2: Configure `application.properties` Directly

For **quick local setup or testing**, you can replace the environment variable placeholders directly in:

```text
backend/src/main/resources/application.properties
```

For example:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/medique_db
spring.datasource.username=postgres
spring.datasource.password=your_database_password

admin.full-name=System Administrator
admin.email=admin@example.com
admin.password=your_admin_password
admin.phone-number=9999999999

jwt.secret=your_secure_jwt_secret
jwt.expiration=3600000
```

This allows you to run the application without configuring environment variables separately.

> **Important:** Directly storing credentials in `application.properties` should only be used for local development or quick testing. Do not commit actual database passwords, administrator passwords, or JWT secrets to GitHub.

# Running the Application

## 1. Navigate to the Backend

From the project root:

```bash
cd backend
```

## 2. Install Dependencies

The project includes the Maven Wrapper.

### Windows

```bash
mvnw.cmd clean install
```

### Linux / macOS

```bash
./mvnw clean install
```

## 3. Start the Backend

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux / macOS

```bash
./mvnw spring-boot:run
```

The Spring Boot application will start at:

```text
http://localhost:8080
```

The REST API base URL is:

```text
http://localhost:8080/api
```

# Application Configuration

The following configuration is used by the backend:

```properties
spring.application.name=medique

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### Database

PostgreSQL must be running before starting the application, and the database configured in `spring.datasource.url` must already exist.

### Administrator

The configured administrator details are used to seed the initial administrator account when the application starts.

### JWT

The configured JWT secret is used to sign authentication tokens, while `JWT_EXPIRATION` determines their validity duration.

# Notes

* PostgreSQL must be running before starting the backend.
* The `medique_db` database must exist before the application starts.
* The `schema.sql` file must be executed before running the application.
* Hibernate is configured with `ddl-auto=none`, so the application does not automatically create or modify database tables.
* The backend currently represents the implemented part of the MediQue system. Frontend installation and running instructions will be added when the React frontend is implemented.
* Never commit real credentials or JWT secrets to the repository.

# Screenshots

Application screenshots will be added after the user interface is completed.


# Future Enhancements

* Email and SMS notifications
* Online payment for appointments
* Video consultations
* Electronic Medical Records (EMR/EHR)
* Multi-hospital support


# Author

**Shaik Mohammed Haneef**

* GitHub: https://github.com/ShaikMohammedHaneef
* LinkedIn: https://www.linkedin.com/in/shaik-mohammed-haneef-2303462bb/
* Portfolio: https://www.shaikmohammedhaneef.me
