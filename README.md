# MedShieldUV — Student Medical Attendance Protection System

> **University of Vavuniya** | 2nd Year Project  
> *Protecting academic records during genuine health crises*

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [User Roles & Default Credentials](#user-roles--default-credentials)
- [Approval Workflow](#approval-workflow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Leave Requests](#leave-requests)
- [Database Schema](#database-schema)
- [Email Notification System](#email-notification-system)
- [Frontend Pages & Routes](#frontend-pages--routes)
- [Known Limitations & Future Improvements](#known-limitations--future-improvements)
- [Author](#author)

---

## Overview

**MedShieldUV** is a full-stack web application built as a 2nd year project for the **University of Vavuniya**. It digitises and enforces a structured, role-based process for students to submit medical leave requests and have those requests reviewed by two independent authorities — the **Medical Council** and the **University Administration** — before any attendance exemption is formally granted.

When a student submits a leave request, an **automated email notification** is sent to the Admin. The Medical Council reviews and approves or rejects the request first; the Admin can only finalise the decision after the Medical Council has acted. This two-stage gatekeeping ensures no leave is approved or rejected without proper medical verification.

---

## Features

### Student
- Self-registration with name, registration number, and password
- Secure login with JWT-based session management
- Submit medical leave requests including reason, date range, and an uploaded medical proof document
- View personal leave request history with real-time dual-status tracking (Medical Council + Admin)
- See whether a request is still active or has been removed from the Admin panel

### Medical Council
- Dedicated login and dashboard
- Review all submitted leave requests with downloadable medical proof documents
- Approve or reject pending requests (action is locked once a decision is made)
- Soft-delete leave records from their own panel (`medicalDeleted` flag)

### Admin
- Dedicated login and dashboard
- Search all leave requests by student name or registration number
- **Approve a leave only after Medical Council approves it** (enforced in both frontend and backend logic)
- **Reject a leave only after Medical Council rejects it** (same enforcement)
- View uploaded medical proof files directly in the browser
- Soft-delete leave records from their own panel (`adminDeleted` flag)
- Receives an automated email notification on every new leave submission

### System
- JWT authentication with a 1-day expiry on all tokens
- Bearer token automatically attached to every API request via an Axios interceptor
- Role-based route guards on the frontend preventing unauthorised page access
- Nodemailer-powered Gmail SMTP email notifications
- Multer file upload with timestamped filenames stored in `backend/uploads/`
- Static file serving for uploaded medical proof documents

---

## System Architecture

---

## User Roles & Default Credentials

| Role | How Account is Created | Login Credentials |
|---|---|---|
| `student` | Self-register via `/register` | Own registration number & password |
| `admin` | Hard-coded in `authRoutes.js` | Registration Number: `ADMIN001` / Password: `admin` |
| `medicalCouncil` | Hard-coded in `authRoutes.js` | Registration Number: `MED001` / Password: `medical` |

> **Important:** Admin and Medical Council accounts are hard-coded directly in the login route. No database entry is needed for these accounts. Student accounts are stored in MongoDB.

---

## Approval Workflow

```
Student submits leave request
          │
          ▼
  ┌───────────────────────────────┐
  │  medicalCouncilStatus = Pending│
  │  adminStatus          = Pending│
  └───────────────────────────────┘
          │
          ▼
  Medical Council reviews request
  + views uploaded medical proof
          │
    ┌─────┴──────┐
    ▼            ▼
 Approve       Reject
    │            │
    ▼            ▼
medicalCouncilStatus   medicalCouncilStatus
   = "Approved"           = "Rejected"
    │                       │
    ▼                       ▼
Admin can now            Admin can now
  APPROVE                  REJECT
    │                       │
    ▼                       ▼
adminStatus            adminStatus
= "Approved"           = "Rejected"
```

The Admin's Approve button is **disabled** in the UI unless `medicalCouncilStatus === "Approved"`, and the Reject button is disabled unless `medicalCouncilStatus === "Rejected"`. This same logic exists in the frontend `updateStatus()` function as a secondary guard.

---

## Tech Stack

### Backend

| Package | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | ^5.2.1 | Web framework |
| Mongoose | ^9.6.2 | MongoDB ODM |
| jsonwebtoken | ^9.0.3 | JWT creation & verification |
| multer | ^2.1.1 | Multipart file upload handling |
| nodemailer | ^8.0.7 | Email notifications via Gmail SMTP |
| dotenv | ^17.4.2 | Environment variable management |
| cors | ^2.8.6 | Cross-origin resource sharing |
| nodemon | ^3.1.14 | Dev auto-restart (devDependency) |

### Frontend

| Package | Version | Purpose |
|---|---|---|
| React | ^19.2.5 | UI framework |
| Vite | ^8.0.10 | Build tool & dev server |
| React Router DOM | ^7.15.0 | Client-side routing |
| Axios | ^1.16.0 | HTTP client with JWT interceptor |

---

## Project Structure

```
medshielduv/
│
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js     # Verifies JWT from Authorization Bearer header
│   │
│   ├── models/
│   │   ├── User.js               # name, registrationNumber, password, role
│   │   └── LeaveRequest.js       # Full leave schema with dual status + soft-delete flags
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # POST /register  |  POST /login (all roles)
│   │   └── leaveRoutes.js        # Full CRUD for leave requests + email notification
│   │
│   ├── uploads/                  # Uploaded medical proof files (served as static)
│   │   └── .gitkeep
│   │
│   ├── .env                      # Email credentials, JWT secret
│   ├── server.js                 # Express entry point — DB connect, routes, static
│   └── package.json
│
└── frontend/
    ├── public/
    │   ├── favicon.svg
    │   └── icons.svg
    │
    ├── src/
    │   ├── assets/
    │   │   └── uvlogo.jpg                    # University of Vavuniya logo
    │   │
    │   ├── pages/
    │   │   ├── Home.jsx                      # Landing page
    │   │   ├── Login.jsx                     # Three-panel login portal
    │   │   ├── Register.jsx                  # Student self-registration
    │   │   ├── Dashboard.jsx                 # Student dashboard
    │   │   ├── SubmitLeave.jsx               # Leave submission form
    │   │   ├── AdminDashboard.jsx            # Admin review panel with search
    │   │   └── MedicalCouncilDashboard.jsx   # Medical Council review panel
    │   │
    │   ├── styles/
    │   │   └── main.css          # Global styles — university brand colour #7b1d4e
    │   │
    │   ├── api.js                # Axios instance + automatic JWT Bearer interceptor
    │   ├── App.jsx               # All route definitions
    │   ├── main.jsx              # React DOM entry point
    │   └── index.css
    │
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017`
- npm (bundled with Node.js)
- A Gmail account with an **App Password** configured (required for email notifications)

---

### Backend Setup

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Configure environment variables
#    Open .env and fill in your Gmail credentials and JWT secret
#    (see Environment Variables section below)

# 4. Ensure MongoDB is running locally
#    Start MongoDB service or open MongoDB Compass

# 5. Start the server

# Production mode
npm start

# Development mode (auto-restarts on file changes)
npm run dev
```

The API will be available at: **`http://localhost:5000`**

---

### Frontend Setup

```bash
# 1. Navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The application will open at: **`http://localhost:5173`**

To build for production:
```bash
npm run build
```

---

## Environment Variables

The `backend/.env` file must contain the following keys:

```env
# Gmail address used to send notification emails
EMAIL_USER=your_gmail@gmail.com

# Gmail App Password (NOT your normal Gmail password)
# Generate at: Google Account → Security → 2-Step Verification → App Passwords
EMAIL_PASS=your_16_character_app_password

# Email address that receives new leave request notifications (Admin inbox)
ADMIN_EMAIL=admin_recipient@gmail.com

# Secret key used to sign and verify JWT tokens (use a long random string)
JWT_SECRET=your_strong_secret_key_here
```

> **Note:** The MongoDB connection URI is currently hard-coded in `server.js` as `mongodb://127.0.0.1:27017/medshield`. It is recommended to move this into `.env` as `MONGO_URI` before any shared or production deployment.

---

## API Reference

All routes marked **protected** require the header:
```
Authorization: Bearer <token>
```

### Authentication

#### `POST /api/auth/register`
Register a new student account.

**Request body (JSON):**
```json
{
  "name": "Fathima Abdul",
  "registrationNumber": "2021/CS/001",
  "password": "yourpassword"
}
```

**Response `201`:**
```json
{
  "_id": "...",
  "name": "Fathima Abdul",
  "registrationNumber": "2021/CS/001",
  "role": "student"
}
```

---

#### `POST /api/auth/login`
Login for all roles. Admin and Medical Council use hard-coded credentials; students are looked up in MongoDB.

**Request body (JSON):**
```json
{
  "registrationNumber": "2021/CS/001",
  "password": "yourpassword"
}
```

**Response `200`:**
```json
{
  "message": "Login successful",
  "token": "<JWT — valid for 1 day>",
  "user": {
    "name": "Fathima Abdul",
    "registrationNumber": "2021/CS/001",
    "role": "student"
  }
}
```

---

### Leave Requests

#### `POST /api/leaves` — *protected*
Submit a new medical leave request. Triggers an email notification to the Admin.

**Content-Type:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `studentName` | string | Yes | Full name of the student |
| `registrationNumber` | string | Yes | University registration number |
| `reason` | string | Yes | Description of the medical condition |
| `fromDate` | date string | Yes | Start date of the absence |
| `toDate` | date string | Yes | End date of the absence |
| `medicalProof` | file | No | Scanned medical certificate (saved as `timestamp-originalname`) |

**Response `201`:** Returns the created `LeaveRequest` document.

---

#### `GET /api/leaves` — *protected*
Fetch all leave requests. The Student Dashboard filters these client-side by `registrationNumber` to show only the logged-in student's records.

**Response `200`:** Array of all `LeaveRequest` documents.

---

#### `GET /api/leaves/:id` — *protected*
Fetch a single leave request by its MongoDB `_id`.

---

#### `PUT /api/leaves/:id` — *protected*
Update fields on a leave request. Used by Medical Council and Admin to set status values.

**Medical Council approving:**
```json
{ "medicalCouncilStatus": "Approved" }
```

**Admin approving (only possible after Medical Council approval):**
```json
{ "adminStatus": "Approved" }
```

**Response `200`:** Returns the updated `LeaveRequest` document.

---

#### `PUT /api/leaves/delete/:id` — *protected*
Soft-delete a leave record for a specific role. Sets `adminDeleted: true` or `medicalDeleted: true` without removing the document from MongoDB.

**Request body:**
```json
{ "role": "medicalCouncil" }
```
or
```json
{ "role": "admin" }
```

**Response `200`:**
```json
{ "message": "Leave hidden successfully" }
```

---

## Database Schema

### `users` collection — `User.js`

| Field | Type | Constraints |
|---|---|---|
| `name` | String | Required |
| `registrationNumber` | String | Required, Unique |
| `password` | String | Required |
| `role` | String | Default: `"student"` |

---

### `leaverequests` collection — `LeaveRequest.js`

| Field | Type | Default | Description |
|---|---|---|---|
| `studentName` | String | Required | Student's full name |
| `registrationNumber` | String | Required | University registration number |
| `reason` | String | Required | Medical reason for leave |
| `fromDate` | Date | Required | Start of the absence period |
| `toDate` | Date | Required | End of the absence period |
| `medicalProof` | String | — | Filename of uploaded document in `uploads/` |
| `medicalCouncilStatus` | String | `"Pending"` | `"Pending"` / `"Approved"` / `"Rejected"` |
| `adminStatus` | String | `"Pending"` | `"Pending"` / `"Approved"` / `"Rejected"` |
| `adminDeleted` | Boolean | `false` | `true` when Admin soft-deletes the record |
| `medicalDeleted` | Boolean | `false` | `true` when Medical Council soft-deletes the record |
| `createdAt` | Date | Auto | Mongoose timestamp |
| `updatedAt` | Date | Auto | Mongoose timestamp |

---

## Email Notification System

When a student successfully submits a leave request, the backend automatically sends a notification email to the Admin using **Nodemailer** over Gmail SMTP (host `smtp.gmail.com`, port `587`, STARTTLS).

**The email contains:**
- Student Name
- Registration Number
- Reason for leave

Credentials are configured in `.env` (`EMAIL_USER`, `EMAIL_PASS`, `ADMIN_EMAIL`). To enable this, generate a **Gmail App Password** from your Google Account security settings — standard Gmail passwords will not work when 2-Step Verification is enabled on the account.

---

## Frontend Pages & Routes

| Route | Component | Access | Description |
|---|---|---|---|
| `/` | `Home.jsx` | Public | Landing page with Login and Register buttons |
| `/login` | `Login.jsx` | Public | Three-panel login (Student / Admin / Medical Council) |
| `/register` | `Register.jsx` | Public | Student account creation form |
| `/dashboard` | `Dashboard.jsx` | `student` only | View leave history, navigate to submit form, logout |
| `/submit` | `SubmitLeave.jsx` | `student` only | Submit a new medical leave request with file upload |
| `/admin` | `AdminDashboard.jsx` | `admin` only | Search, review, approve or reject all leave requests |
| `/medical` | `MedicalCouncilDashboard.jsx` | `medicalCouncil` only | Approve, reject, or delete leave requests |

Route guards are implemented in each protected component's `useEffect`. If no token is found in `localStorage`, or the stored role does not match the required role, the user is immediately redirected to `/login`.

---

## Known Limitations & Future Improvements

| Area | Current State | Recommended Improvement |
|---|---|---|
| **Password security** | Passwords stored as plain text in MongoDB | Implement `bcrypt` hashing on register; use `bcrypt.compare` on login |
| **Hard-coded admin credentials** | Admin and Medical Council credentials are in `authRoutes.js` source code | Store in MongoDB with hashed passwords; remove hard-coded values |
| **Hard-coded email in source** | Gmail address and app password appear in `leaveRoutes.js` | Use `process.env.EMAIL_USER` and `process.env.ADMIN_EMAIL` consistently |
| **Hard-coded MongoDB URI** | `server.js` connects to a fixed local URI string | Move to `process.env.MONGO_URI` |
| **Client-side role trust** | Frontend reads `role` from `localStorage` for access control | Decode role from JWT on the server side for every protected request |
| **No pagination** | Admin dashboard fetches all records in one request | Add server-side pagination and search query parameters |
| **Edit Profile** | Button displays a "coming soon" alert | Implement a profile update endpoint and form |
| **File storage** | Uploaded files are saved to a local `uploads/` folder | Use cloud storage (AWS S3, Cloudinary) for any non-local deployment |
| **`isDeleted` field mismatch** | `Dashboard.jsx` checks `leave.isDeleted`, but the schema uses `adminDeleted` and `medicalDeleted` | Align field names across frontend and backend |
| **No 401 interceptor** | Expired JWTs cause silent API failures | Add an Axios response interceptor to catch 401 errors and redirect to `/login` |
| **No token refresh** | JWT expires after 1 day with no renewal mechanism | Implement a refresh token strategy for longer sessions |

---

## Author

Developed as a 2nd Year Project at the **University of Vavuniya**.  
Project: **MedShieldUV — Student Medical Attendance Protection System**

---

*University of Vavuniya © 2026. All rights reserved.*
