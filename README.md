# Task Management Application
    This is a full-stack task management application built with React + TypeScript (frontend), Node.js (backend), and PostgreSQL (database). The app allows users to register, log in, and manage tasks with full CRUD functionality. Only authenticated users can access and manipulate tasks.
    Author: Keshav Dave

# Features
    User Authentication: Register and log in with hashed passwords (bcrypt). JWT tokens secure protected routes.
    Task Management: Create, read, update, and delete tasks.
    Authentication Protected Routes: All task-related operations require a valid JWT token.
    Backend Setup (Node.js, Express, PostgreSQL)

# Languagues Used
    Node.js
    PostgreSQL


1. Clone the Repository
    git clone <repository-url>
    cd backend
2. Install Dependencies
    npm install
3. Environment Variables
    Create a .env file in the backend folder:
    DATABASE_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
    JWT_SECRET=your_jwt_secret
4. Backend Server
    The backend runs on http://localhost:5000.

    Backend Endpoints
    Authentication
    POST /auth/register: Register a new user (username, password)
    POST /auth/login: Log in a user and return JWT
    Tasks (Protected)
    GET /tasks: Retrieve all tasks for authenticated user
    POST /tasks: Create a new task
    PUT /tasks/:id: Update an existing task
    DELETE /tasks/:id: Delete a task
    Frontend Setup (React + TypeScript)

# Run
    npm start
    The frontend runs on http://localhost:3000.

# Application Flow
    Register a User
    Go to http://localhost:3000/register.
    Provide a username and password.
    On successful registration, you will be redirected to the login page.
    Login
    Go to http://localhost:3000/login.
    Enter your username and password.
    After successful login, you'll be redirected to the tasks page.
    Manage Tasks
    Create: Add a new task using the form.
    Edit: Change the task or description.
    Update: Mark tasks complete.
    Delete: Remove tasks.
    Logout
    Use the logout button in the navigation bar to clear your session.
    Notes on Testing
    Ensure PostgreSQL is running locally with the correct database setup.
    Use valid JWT tokens for any API testing via Postman or similar tools.

# Personal Coding Difficulties
    Getting set up with authentication and interacting between different parts of the code
    Getting the frontend and backend to connect
    Making it so the login and registration pages can interact with each other properly
    Getting the tasks page to load data and recognize which users were tasks were being dealt with
    Saving information in the backend relevent to authentication and task handling

# Video Demo 
    Shows user registration, login, task creation, updating, and deletion.
    Look in main branch of the repository to find it

Lumaa Salary Expectations: $25 an hour +
