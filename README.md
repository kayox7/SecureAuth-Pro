# 🔐 SecureAuth-Pro

A secure authentication system built with **Node.js, Express.js, MySQL, JWT, and Google Authenticator (2FA)**. The project demonstrates enterprise-level authentication features including email verification, password reset, login history, brute-force protection, and multi-device session management.

---

## 🚀 Features

### 👤 User Authentication
- User Registration
- Secure Login
- JWT Authentication
- Access & Refresh Tokens
- Logout
- Logout from All Devices

### 📧 Email Features
- Email Verification
- Resend Verification Email
- Forgot Password
- Password Reset via Email

### 🔒 Security Features
- Password Hashing using bcrypt
- Strong Password Validation
- Google Authenticator (2FA)
- Brute Force Protection
- Account Lock after Multiple Failed Attempts
- Helmet Security Middleware
- Rate Limiting
- Secure HTTP Cookies

### 📊 User Dashboard
- Profile Information
- Login History
- Device Information
- Change Password
- Enable / Disable Two-Factor Authentication

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Authentication
- JWT (JSON Web Tokens)
- bcrypt
- Google Authenticator (Speakeasy)
- QRCode

### Email
- Nodemailer

### Security
- Helmet
- Express Rate Limit
- Cookie Parser

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

---

## 📂 Project Structure

```
SecureAuth-Pro/
│
├── config/
├── controllers/
├── middleware/
├── public/
│   ├── css/
│   └── js/
├── routes/
├── validators/
├── views/
├── app.js
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/kayox7/SecureAuth-Pro.git
```

### Navigate to Project

```bash
cd SecureAuth-Pro
```

### Install Dependencies

```bash
npm install
```

### Create `.env`

Create a `.env` file in the project root.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=secureauth

JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
MAIL_FROM=your_email@gmail.com
```

### Start Server

```bash
npm start
```

or

```bash
nodemon server.js
```

---

## 🗄️ Database

Create a MySQL database:

```sql
CREATE DATABASE secureauth;
```

Import the required tables before running the application.

---

## 🔐 Security Features Implemented

- JWT Authentication
- Password Hashing (bcrypt)
- Refresh Tokens
- Google Authenticator 2FA
- Email Verification
- Forgot Password
- Password Reset
- Brute Force Protection
- Login History
- Logout All Devices
- Helmet Middleware
- Rate Limiting
- Secure Cookies

---

## 📸 Screenshots

### Login Page

> Add screenshot here

---

### Dashboard

> Add screenshot here

---

### Google Authenticator Setup

> Add screenshot here

---

### Password Reset

> Add screenshot here

---

## 📌 Future Improvements

- OAuth Login (Google & GitHub)
- User Profile Image Upload
- Admin Dashboard
- Docker Support
- Unit Testing
- CI/CD Pipeline
- Session Management Dashboard

---

## 👨‍💻 Author

**Kayox7**

- GitHub: https://github.com/kayox7
- LinkedIn: *(Add your LinkedIn profile here)*

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.
