# SparkleWash – Car Wash Booking System

SparkleWash is a full-stack web application that enables customers to book professional car wash services, manage multiple vehicles, and make secure payments through M-Pesa, including partial deposits. Administrators have access to a dedicated dashboard for managing users, services, bookings, vehicles, and payments.

---

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Protected Routes](#protected-routes)
- [Application Workflow](#application-workflow)
- [Deployment](#deployment)
- [License](#license)
- [Contributors](#contributors)

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://sparklewash.vercel.app |
| Backend API | https://sparklewash.onrender.com |
| Swagger Documentation | https://sparklewash.onrender.com/apidocs |

---

# Features

### Authentication

- User Registration
- User Login & Logout
- JWT Authentication
- Password Reset via Email
- Email Verification Support
- Role-Based Authorization

### Customer Features

- Browse Available Services
- Book Car Wash Services
- Manage Multiple Vehicles
- View Booking History
- Make Partial or Full Payments
- View Payment History

### Admin Features

- Manage Users
- Manage Services
- Manage Bookings
- Manage Vehicles
- Manage Payments
- Dashboard Analytics

### Payment Features

- M-Pesa STK Push Integration
- Deposit Payments
- Complete Remaining Balance Later
- Automatic Payment Status Updates

### Other Features

- Swagger API Documentation
- Responsive User Interface
- Protected Routes
- Modern Tailwind CSS Design

---

# Tech Stack

| Category | Technologies |
|----------|--------------|
| Frontend | React (Vite), React Router DOM, Tailwind CSS, Axios, Sonner, Lucide React |
| Backend | Flask, Flask-RESTful, Flask-JWT-Extended, Flask-SQLAlchemy, Flask-CORS, Marshmallow, Flasgger, Structlog |
| Database | SQLite (Development), PostgreSQL (Production), Alembic |
| Authentication | JWT |
| Payments | Safaricom Daraja API (M-Pesa) |
| Email | Brevo (SendinBlue) |formspree|
| Development | ngrok, Git, GitHub |

---

# Project Structure

```text
sparklewash/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── customer/
│   │   │   └── public/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── extensions.py
│   ├── requirements.txt
│   ├── seed.py
│   ├── .env
│   ├── models/
│   │   ├── user.py
│   │   ├── booking.py
│   │   ├── payment.py
│   │   ├── service.py
│   │   └── vehicle.py
│   ├── schemas/
│   ├── resources/
│   ├── utils/
│   └── migrations/
│
├── README.md
└── LICENSE
```

---

# Installation & Setup

## Prerequisites

- Python 3.10+
- Node.js 16+
- pip
- Git
- ngrok (for M-Pesa callback testing)
- formspree for contact email
- brevo for email token

---

## 1. Clone Repository

```bash
git clone https://github.com/roy9html/SparkleWash.git

cd SparkleWash
```

---

## 2. Frontend Setup

```bash
cd frontend

npm install

cp .env.example .env
```

Update the `.env` file with your backend URL.

---

## 3. Backend Setup

```bash
cd ../backend

python -m venv venv
```

### Linux/macOS

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

Copy the environment file.

```bash
cp .env.example .env
```

Fill in all required environment variables.

---

## 4. Run Database Migrations

```bash
flask db upgrade
```

---

## 5. Seed Database (Optional)

```bash
python seed.py
```

---

## 6. Run the Application

### Backend

```bash
flask run
```

### Frontend

```bash
npm run dev
```

---
### ngrok

``` bash
ngrok http 5000

```

# Environment Variables

## Backend (.env)

```env
# Flask
SECRET_KEY=secret-key
JWT_SECRET_KEY=jwt-secret-key
DATABASE_URL=sqlite:///instance/app.db

# Frontend
FRONTEND_URL=http://localhost:5173

# Email
BREVO_API_KEY=brevo-api-key
BREVO_SENDER_EMAIL=mumod758@gmail.com
BREVO_SENDER_NAME=SparkleWash

# M-Pesa
MPESA_CONSUMER_KEY=consumer-key
MPESA_CONSUMER_SECRET=consumer-secret
MPESA_PASSKEY=your-passkey
MPESA_SHORTCODE=174379
MPESA_SHORTCODE_TYPE=paybill
MPESA_CALLBACK_URL=https://-ngrok-url.ngrok-free.app/payments/callback
MPESA_ENVIRONMENT=sandbox
```

---

## Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

---

# Database Schema

## Models

### User

- id
- name
- email
- password_hash
- role
- status
- created_at
- updated_at

---

### Service

- id
- name
- description
- price
- duration_minutes
- is_active
- created_at

---

### Booking

- id
- user_id
- service_id
- vehicle_id
- booking_date
- status
- total_amount
- paid_amount
- notes
- created_at
- updated_at

---

### Payment

- id
- booking_id
- user_id
- amount
- payment_method
- transaction_id
- status
- mpesa_receipt
- mpesa_phone
- payment_date

---

### Vehicle

- id
- user_id
- plate_number
- make
- model
- year
- color
- is_default
- created_at

---


## Relationships

### One-to-Many

- User → Bookings
- User → Vehicles
- User → Payments
- Service → Bookings
- Booking → Payments

### Many-to-Many

- Service ↔ AddOn

---

# API Endpoints

## Authentication

| Method | Endpoint | Description | Auth |
|-------|-----------|------------|------|
| POST | /auth/register | Register User |
| POST | /auth/login | Login |
| GET | /auth/me | Current User |
| POST | /auth/refresh | Refresh Token |
| DELETE | /auth/logout | Logout |
| POST | /auth/forgot-password | Forgot Password |
| POST | /auth/reset-password | Reset Password |

---

## Users

| Method | Endpoint | Description |
|-------|----------|-------------|
| GET | /users | List Users |
| GET | /users/<id> | User Details |
| PUT | /users/<id> | Update User |
| DELETE | /users/<id> | Delete User |

---

## Services

| Method | Endpoint |
|-------|----------|
| GET | /services |
| POST | /services |
| PUT | /services/<id> |
| DELETE | /services/<id> |

---

## Bookings

| Method | Endpoint |
|-------|----------|
| GET | /bookings |
| POST | /bookings |
| GET | /bookings/<id> |
| PUT | /bookings/<id> |
| DELETE | /bookings/<id> |

---

## Payments

| Method | Endpoint |
|-------|----------|
| GET | /payments |
| POST | /payments |
| GET | /payments/<id> |
| PUT | /payments/<id> |
| DELETE | /payments/<id> |
| POST | /payments/callback |

---

## Vehicles

| Method | Endpoint |
|-------|----------|
| GET | /vehicles |
| POST | /vehicles |
| GET | /vehicles/<id> |
| PUT | /vehicles/<id> |
| DELETE | /vehicles/<id> |

---

# Protected Routes

| Route | Access |
|-------|--------|
| /profile | Customer, Admin |
| /customer/dashboard | Customer |
| /customer/bookings | Customer |
| /admin/dashboard | Admin |
| /admin/users | Admin |
| /payments | Customer, Admin |

---

# Application Workflow

## Authentication Flow

1. User registers.
2. Password is hashed.
3. User logs in.
4. JWT token is generated.
5. Token is stored in Local Storage.
6. Protected requests include:

```http
Authorization: Bearer <token>
```

7. Logout removes the token.

---

## Booking Flow

1. Customer selects a service.
2. Customer enters vehicle details.
3. Vehicle is created (or existing one is used).
4. Booking is created.
5. Booking status becomes **Pending**.
6. Customer proceeds to payment.

---

## Payment Flow

1. Customer enters phone number.
2. Backend initiates Daraja STK Push.
3. Customer receives STK Prompt.
4. Customer enters M-Pesa PIN.
5. Callback updates payment.
6. Booking paid amount is updated.
7. Booking status changes to **Completed** once fully paid.

FOR PRODUCTION PURPOSES ONLY FOR DEPLOYMENT WE INTEGRATE WITH REAL PAYBILL

---

# Deployment

## Backend (Render)

```text
Build Command:
pip install -r requirements.txt
```

```text
Start Command:
gunicorn app:app
```

Remember to configure all environment variables on Render.

---

## Frontend (Vercel )

1. Import repository.
2. Set

```
VITE_API_URL
```

to your deployed backend URL.

3. Deploy.

---

# License

This project is licensed under the **MIT License**.

See the **LICENSE** file for more information.

---

# Contributors

### Brenden Murimi

- Authentication
- User Management
- Password Reset
- Protected Routes
- Email Integration

### John Kamau

- Services
- Bookings
- Vehicle Management
- Customer Dashboard

### Muthui Daniel

- Payments
- M-Pesa Integration
- Seed Data
- Admin Dashboard