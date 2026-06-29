# Database Design

## Overview

The MediQue database is designed using a relational database model to efficiently manage hospital departments, staff, patients, doctor schedules, and queue information.

The database is normalized to reduce data redundancy and maintain data integrity while supporting the application's core functionalities such as OP booking, queue management, and real-time queue tracking.

## Database Components

The database consists of the following main entities:

* Department
* Doctor
* Receptionist
* Administrator
* Patient
* QueueToken

## Entity Relationship Diagram

Refer to `er-diagram.png` for the complete Entity Relationship (ER) Diagram.

## Table Definitions

Detailed information about each table, including columns, data types, constraints, and relationships, is available in `tables.md`.

## Database Schema

The SQL script used to create the database is available in `schema.sql`.
