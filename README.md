# Online Course Registration System

A web-based course registration system built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **Student Features:**
  - View available courses
  - Register for courses
  - View registered courses

- **Admin Features:**
  - Add new courses
  - Remove courses

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB, JWT for authentication
- **Frontend:** React.js, Axios for API calls
- **Database:** MongoDB

## Installation

1. **Backend Setup:**
   - Navigate to `backend` directory
   - Run `npm install`
   - Create a `.env` file with `MONGO_URI` and `JWT_SECRET`
   - Run `npm start` or `npm run dev`

2. **Frontend Setup:**
   - Navigate to `frontend` directory
   - Run `npm install`
   - Run `npm start`

3. **MongoDB:**
   - Ensure MongoDB is running locally or provide a connection string

## Usage

- Register as a student or admin
- Login to access the system
- Students can browse and register for courses
- Admins can manage courses

## API Endpoints

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Add course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)
- `POST /api/registrations` - Register for course
- `GET /api/registrations/my` - Get user's registrations