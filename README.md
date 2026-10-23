# Healthcare Backend REST API

A secure, production-ready backend system for managing healthcare records, patients, doctors, and patient-doctor appointments/mappings. Built with **Node.js**, **Express.js**, **PostgreSQL**, and **Sequelize ORM**.

---

##  Features

- **User Authentication**: Secure registration and login using **JWT (`jsonwebtoken`)** and **password hashing (`bcryptjs`)**.
- **Role & Record Ownership**: Patient records are securely tied to the creating user, with strict authorization checks.
- **Doctor Management**: Complete CRUD operations for doctor profiles including specialization and experience.
- **Patient-Doctor Mappings**: Many-to-many relationship management with duplicate assignment prevention and cascade deletion.
- **Input Validation**: Robust request validation and sanitization using **`express-validator`**.
- **Centralized Error Handling**: Standardized JSON responses for validation errors, database constraints (unique, foreign key), and internal server errors.
- **Automated Testing**: 100% test coverage for all endpoints using **Jest** and **Supertest** (28 passing tests).
- **Postman Ready**: Pre-configured Postman Collection with automatic token chaining included.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Server-side JavaScript runtime |
| **Express.js** | Web application framework for RESTful APIs |
| **PostgreSQL** | Relational database management system |
| **Sequelize ORM** | Object-Relational Mapping for database modeling and associations |
| **JSON Web Token (JWT)** | Stateless authentication and token verification |
| **bcryptjs** | Password hashing with salt rounds |
| **express-validator** | Request payload validation and error aggregation |
| **dotenv** | Environment variable management |
| **Jest & Supertest** | Automated unit and integration testing |

---

## 📁 Project Structure

```text
healthcare-backend/
├── .env                          # Local environment variables
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore configuration
├── package.json                  # Dependencies & scripts
├── postman_collection.json       # Ready-to-import Postman Collection
├── README.md                     # Comprehensive documentation
├── server.js                     # Application entry point & DB sync
├── src/
│   ├── app.js                    # Express app configuration & middlewares
│   ├── config/
│   │   └── database.js           # PostgreSQL connection & Sequelize instance
│   ├── controllers/
│   │   ├── authController.js     # User registration and login logic
│   │   ├── patientController.js  # Patient CRUD and ownership logic
│   │   ├── doctorController.js   # Doctor CRUD operations
│   │   └── mappingController.js  # Patient-Doctor assignment logic
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & user attachment
│   │   ├── errorHandler.js       # Global error handler
│   │   └── validate.js           # express-validator result handler
│   ├── models/
│   │   ├── index.js              # Model associations & exports
│   │   ├── User.js               # User model schema
│   │   ├── Patient.js            # Patient model schema
│   │   ├── Doctor.js             # Doctor model schema
│   │   └── PatientDoctor.js      # Patient-Doctor mapping model schema
│   ├── routes/
│   │   ├── index.js              # API router aggregator (/api)
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── patientRoutes.js      # /api/patients routes
│   │   ├── doctorRoutes.js       # /api/doctors routes
│   │   └── mappingRoutes.js      # /api/mappings routes
│   └── validations/
│       ├── authValidation.js     # Validation rules for auth
│       ├── patientValidation.js  # Validation rules for patients
│       ├── doctorValidation.js   # Validation rules for doctors
│       └── mappingValidation.js  # Validation rules for mappings
└── tests/
    └── api.test.js               # 28 integration test cases
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory (refer to `.env.example`):

```env
PORT=5001
NODE_ENV=development

# PostgreSQL Database Configuration
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=healthcare_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres

# JWT Configuration
JWT_SECRET=super_secret_healthcare_jwt_key_2026_secure
JWT_EXPIRES_IN=24h
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or newer)
- PostgreSQL (v14 or newer) running locally or remotely

### 2. Database Setup
Create the PostgreSQL database:
```bash
createdb healthcare_db
```

### 3. Installation
Install project dependencies:
```bash
npm install
```

### 4. Running the Server
To run in development mode (with auto-reload):
```bash
npm run dev
```

To run in production mode:
```bash
npm start
```

The server will start on `http://localhost:5001` and automatically create/sync all database tables.

### 5. Running Automated Tests
Run the automated test suite covering all 28 API test scenarios:
```bash
npm test
```

---

## 📚 API Endpoints Documentation

All requests accepting JSON must include `Content-Type: application/json`.
Protected routes require the `Authorization: Bearer <token>` header.

### 1. Authentication APIs

#### Register User
- **Method & URL**: `POST /api/auth/register/`
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Dr. Jane Smith",
  "email": "jane.smith@healthcare.org",
  "password": "SecurePassword123!"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": 1,
      "name": "Dr. Jane Smith",
      "email": "jane.smith@healthcare.org",
      "createdAt": "2026-10-22T17:50:00.000Z",
      "updatedAt": "2026-10-22T17:50:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
- **Method & URL**: `POST /api/auth/login/`
- **Access**: Public
- **Request Body**:
```json
{
  "email": "jane.smith@healthcare.org",
  "password": "SecurePassword123!"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "User logged in successfully.",
  "data": {
    "user": {
      "id": 1,
      "name": "Dr. Jane Smith",
      "email": "jane.smith@healthcare.org"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. Patient Management APIs

*All patient endpoints require `Authorization: Bearer <token>`.*

#### Add a New Patient
- **Method & URL**: `POST /api/patients/`
- **Access**: Private
- **Request Body**:
```json
{
  "name": "Michael Johnson",
  "age": 45,
  "gender": "Male",
  "contact": "+1-555-234-5678",
  "address": "100 Hospital Way, Chicago, IL",
  "medical_history": "Type 2 Diabetes, Seasonal Allergies"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Patient record created successfully.",
  "data": {
    "id": 1,
    "name": "Michael Johnson",
    "age": 45,
    "gender": "Male",
    "contact": "+1-555-234-5678",
    "address": "100 Hospital Way, Chicago, IL",
    "medical_history": "Type 2 Diabetes, Seasonal Allergies",
    "userId": 1,
    "createdAt": "2026-10-22T17:52:00.000Z",
    "updatedAt": "2026-10-22T17:52:00.000Z"
  }
}
```

#### Retrieve All Patients Created by Authenticated User
- **Method & URL**: `GET /api/patients/`
- **Access**: Private
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "message": "Patients retrieved successfully.",
  "data": [
    {
      "id": 1,
      "name": "Michael Johnson",
      "age": 45,
      "gender": "Male",
      "contact": "+1-555-234-5678",
      "address": "100 Hospital Way, Chicago, IL",
      "medical_history": "Type 2 Diabetes, Seasonal Allergies",
      "userId": 1,
      "doctors": []
    }
  ]
}
```

#### Get Details of a Specific Patient
- **Method & URL**: `GET /api/patients/:id/`
- **Access**: Private
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Patient details retrieved successfully.",
  "data": {
    "id": 1,
    "name": "Michael Johnson",
    "age": 45,
    "gender": "Male",
    "contact": "+1-555-234-5678",
    "address": "100 Hospital Way, Chicago, IL",
    "medical_history": "Type 2 Diabetes, Seasonal Allergies",
    "creator": {
      "id": 1,
      "name": "Dr. Jane Smith",
      "email": "jane.smith@healthcare.org"
    },
    "doctors": []
  }
}
```

#### Update Patient Details
- **Method & URL**: `PUT /api/patients/:id/`
- **Access**: Private (Creator only)
- **Request Body**:
```json
{
  "contact": "+1-555-888-9999",
  "medical_history": "Type 2 Diabetes controlled with medication"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Patient details updated successfully.",
  "data": {
    "id": 1,
    "name": "Michael Johnson",
    "contact": "+1-555-888-9999",
    "medical_history": "Type 2 Diabetes controlled with medication"
  }
}
```

#### Delete Patient Record
- **Method & URL**: `DELETE /api/patients/:id/`
- **Access**: Private (Creator only)
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Patient record with ID 1 deleted successfully."
}
```

---

### 3. Doctor Management APIs

*All doctor management endpoints require `Authorization: Bearer <token>`.*

#### Add a New Doctor
- **Method & URL**: `POST /api/doctors/`
- **Access**: Private
- **Request Body**:
```json
{
  "name": "Dr. Sarah Connor",
  "specialization": "Endocrinology",
  "phone": "+1-555-432-8765",
  "email": "sarah.connor@hospital.org",
  "experience_years": 12
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Doctor record created successfully.",
  "data": {
    "id": 1,
    "name": "Dr. Sarah Connor",
    "specialization": "Endocrinology",
    "phone": "+1-555-432-8765",
    "email": "sarah.connor@hospital.org",
    "experience_years": 12
  }
}
```

#### Retrieve All Doctors
- **Method & URL**: `GET /api/doctors/`
- **Access**: Private
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "message": "Doctors retrieved successfully.",
  "data": [
    {
      "id": 1,
      "name": "Dr. Sarah Connor",
      "specialization": "Endocrinology",
      "phone": "+1-555-432-8765",
      "email": "sarah.connor@hospital.org",
      "experience_years": 12
    }
  ]
}
```

#### Get Details of a Specific Doctor
- **Method & URL**: `GET /api/doctors/:id/`
- **Access**: Private
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Doctor details retrieved successfully.",
  "data": {
    "id": 1,
    "name": "Dr. Sarah Connor",
    "specialization": "Endocrinology",
    "phone": "+1-555-432-8765",
    "email": "sarah.connor@hospital.org",
    "experience_years": 12,
    "patients": []
  }
}
```

#### Update Doctor Details
- **Method & URL**: `PUT /api/doctors/:id/`
- **Access**: Private
- **Request Body**:
```json
{
  "experience_years": 13,
  "phone": "+1-555-999-7777"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Doctor details updated successfully.",
  "data": {
    "id": 1,
    "name": "Dr. Sarah Connor",
    "experience_years": 13,
    "phone": "+1-555-999-7777"
  }
}
```

#### Delete Doctor Record
- **Method & URL**: `DELETE /api/doctors/:id/`
- **Access**: Private
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Doctor record with ID 1 deleted successfully."
}
```

---

### 4. Patient-Doctor Mapping APIs

*All mapping endpoints require `Authorization: Bearer <token>`.*

#### Assign a Doctor to a Patient
- **Method & URL**: `POST /api/mappings/`
- **Access**: Private
- **Request Body**:
```json
{
  "patient_id": 1,
  "doctor_id": 1,
  "notes": "Follow-up quarterly for endocrine assessment"
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Doctor successfully assigned to patient.",
  "data": {
    "id": 1,
    "patientId": 1,
    "doctorId": 1,
    "notes": "Follow-up quarterly for endocrine assessment",
    "patient": {
      "id": 1,
      "name": "Michael Johnson",
      "age": 45,
      "gender": "Male",
      "contact": "+1-555-234-5678"
    },
    "doctor": {
      "id": 1,
      "name": "Dr. Sarah Connor",
      "specialization": "Endocrinology",
      "phone": "+1-555-432-8765",
      "email": "sarah.connor@hospital.org"
    }
  }
}
```

#### Retrieve All Patient-Doctor Mappings
- **Method & URL**: `GET /api/mappings/`
- **Access**: Private
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "message": "Patient-doctor mappings retrieved successfully.",
  "data": [
    {
      "id": 1,
      "patientId": 1,
      "doctorId": 1,
      "notes": "Follow-up quarterly for endocrine assessment",
      "patient": {
        "id": 1,
        "name": "Michael Johnson"
      },
      "doctor": {
        "id": 1,
        "name": "Dr. Sarah Connor",
        "specialization": "Endocrinology"
      }
    }
  ]
}
```

#### Get All Doctors Assigned to a Specific Patient
- **Method & URL**: `GET /api/mappings/:patient_id/`
- **Access**: Private
- **Response (200 OK)**:
```json
{
  "success": true,
  "patient": {
    "id": 1,
    "name": "Michael Johnson"
  },
  "count": 1,
  "message": "Doctors assigned to patient Michael Johnson retrieved successfully.",
  "data": [
    {
      "id": 1,
      "patientId": 1,
      "doctorId": 1,
      "doctor": {
        "id": 1,
        "name": "Dr. Sarah Connor",
        "specialization": "Endocrinology",
        "phone": "+1-555-432-8765",
        "email": "sarah.connor@hospital.org",
        "experience_years": 13
      }
    }
  ]
}
```

#### Remove a Doctor from a Patient
- **Method & URL**: `DELETE /api/mappings/:id/`
- **Access**: Private
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Patient-Doctor mapping with ID 1 removed successfully."
}
```

---

## 🧪 Postman Collection Import

1. Open Postman.
2. Click **Import** in the top-left corner.
3. Choose the [postman_collection.json](file:///Users/ankit/Desktop/Whatbytes/postman_collection.json) file located in the project root.
4. When you execute the **Register User** or **Login User** request, Postman automatically captures the JWT token and saves it in `{{authToken}}` so subsequent protected requests work immediately without manual copy-pasting.

---

## 🔒 Security Best Practices Implemented

1. **Password Hashing**: Passwords are never stored in plain text. Salted bcrypt rounds hash passwords on creation and update.
2. **Sensitive Data Filtering**: The `toJSON()` method on the User model strips password hashes from all outbound JSON payloads.
3. **Stateless JWT Authorization**: Bearer tokens are validated on every secured route with expiry checks and user existence verification.
4. **Data Integrity & Relational Constraints**: Foreign key references and unique indexes protect against duplicate assignments and orphan records.
5. **Input Sanitization**: Express-validator normalizes emails and enforces data types before reaching controllers.
