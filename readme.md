This is a system for an interview assessment by Infomina.
Tech used: React as frontend, Node.js/Express as backend and MySQL for database.
The scenario given is to create a system for a friend that works in fitness/gym and for them to manage their members.

# Fitness Center Management System

This project is a full-stack application for managing a fitness center, built with React, Node.js/Express, and MySQL.

## System Requirements

- Node.js (v14.0.0 or later)
- MySQL (v5.7 or later)
- npm (v6.0.0 or later)

## Getting Started

### 1. Database Setup

1. Create a MySQL database named `fitness_center`
2. Execute the following SQL script to create the necessary tables:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(20),
  address TEXT,
  date_of_birth DATE,
  gender VARCHAR(10),
  membership_type ENUM('basic', 'premium', 'gold') DEFAULT 'basic',
  membership_status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
  start_date DATE,
  end_date DATE,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content (adjust as needed):
   ```
   PORT=5000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=fitness_center
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the backend server:
   ```
   npm start
   ```
   The server should start running on http://localhost:5000

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```
   npm start
   ```
   The application should open in your browser at http://localhost:3000

## Features Demonstration

### Authentication
1. Register a new account from the login page
2. Try logging in with your credentials
3. Test the "forgot password" functionality

### Dashboard
1. View the statistics showing total, active, pending, and inactive members
2. Check the membership type distribution
3. Use the quick action buttons to navigate or refresh data

### Member Management
1. Navigate to the Members List page
2. Add a new member using the "Add New Member" button
3. Search for members using the search box
4. Filter members by status or membership type
5. Sort the member list by clicking on column headers
6. View, edit, and delete members using the action buttons

## Troubleshooting

If you encounter any issues:

1. **Database Connection Issues**:
   - Verify MySQL is running
   - Check your database credentials in the backend `.env` file
   - Ensure the database and tables are created correctly

2. **Backend Server Issues**:
   - Check the console for error messages
   - Verify the port (5000) is not in use by another application
   - Make sure all dependencies are installed correctly

3. **Frontend Issues**:
   - Ensure the backend server is running
   - Check the API URL in the frontend `.env` file
   - Clear your browser cache if experiencing unexpected behavior

4. **Authentication Issues**:
   - Verify the JWT_SECRET is set in the backend `.env` file
   - Check that cookies are enabled in your browser

## API Documentation

The backend provides the following API endpoints:

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token
- `POST /api/auth/forgot-password` - Request password reset

### Members
- `GET /api/members` - Get all members
- `GET /api/members/:id` - Get a specific member
- `POST /api/members` - Create a new member
- `PUT /api/members/:id` - Update a member
- `DELETE /api/members/:id` - Delete a member
- `GET /api/members/search?q=query` - Search for members
- `GET /api/members/filter?status=X&type=Y` - Filter members
