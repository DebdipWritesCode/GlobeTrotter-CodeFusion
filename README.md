# GlobeTrotter – Empowering Personalized Travel Planning

## Introduction

**GlobeTrotter** is a personalized, intelligent, and collaborative travel planning platform designed to simplify the complexities of organizing multi-city trips. The platform enables users to explore destinations, create customized itineraries, estimate budgets, and visualize their travel plans in an intuitive and interactive way.

The aim is to make travel planning as engaging as the journey itself, allowing users to discover new places, manage costs effectively, and share their plans with friends or the public.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [System Architecture](#system-architecture)
4. [User Flow](#user-flow)
5. [Installation & Setup](#installation--setup)
6. [Usage Guide](#usage-guide)
7. [Screenshots](#screenshots)
8. [Demo Video](#demo-video)
9. [Database Schema](#database-schema)
10. [Future Enhancements](#future-enhancements)
11. [Contributing](#contributing)
12. [License](#license)

---

## Features

### 1. Authentication & User Management

* Secure login/signup system with email and password
* Forgot password functionality
* User profile management and preferences

### 2. Trip Creation & Management

* Create multi-city itineraries with start and end dates
* Add detailed descriptions and cover photos
* Edit, view, or delete trips

### 3. Itinerary Builder

* Add stops, activities, and travel dates for each city
* Assign activities with costs and durations
* Reorder cities and activities interactively

### 4. Search & Discovery

* City search with country, cost index, and popularity details
* Activity search with filters for type, cost, and duration

### 5. Budgeting & Cost Tracking

* Automatic budget estimation
* Cost breakdown by transport, stay, meals, and activities
* Visual budget charts and overbudget alerts

### 6. Visualization & Sharing

* Timeline and calendar-based trip visualization
* Public itinerary sharing with a unique link
* “Copy Trip” functionality for quick reuse

### 7. Admin Dashboard (Optional)

* Track user trends, trip statistics, and popular destinations
* Manage users and platform data

---

## Tech Stack

**Frontend:**

* React.js / Next.js
* Tailwind CSS / Material UI
* Chart.js or Recharts for data visualization

**Backend:**

* Node.js with Express.js
* RESTful API architecture

**Database:**

* PostgreSQL / MySQL (Relational database for structured trip data)

**Authentication & Security:**

* JWT (JSON Web Tokens)
* Bcrypt for password hashing

**Deployment:**

* Vercel / Netlify for frontend
* Render / Heroku for backend

---

## System Architecture

* **Client Layer:** Interactive UI for users to plan and view trips
* **API Layer:** REST API for handling CRUD operations and data retrieval
* **Database Layer:** Relational schema storing users, trips, cities, activities, and budgets

---

## User Flow

1. **Login / Signup** – Users authenticate and access their dashboard
2. **Dashboard** – View upcoming trips and recommended destinations
3. **Create Trip** – Add trip details, dates, and destinations
4. **Itinerary Builder** – Add stops, activities, and arrange the plan
5. **Budget Estimation** – View cost breakdowns and budget alerts
6. **Visualization** – See the trip in calendar/timeline format
7. **Sharing** – Share trips publicly or keep them private
8. **Admin Panel** – Monitor app analytics and manage users (optional)

---

## Installation & Setup

```bash
# Clone the repository
git clone https://github.com/DebdipWritesCode/GlobeTrotter-CodeFusion.git

# Navigate to project folder
cd GlobeTrotter-CodeFusion

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Setup environment variables (example .env)
# FRONTEND: .env.local
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# BACKEND: .env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GMAIL_USER=your_gmail_username
GMAIL_APP_PASSWORD=your_gmail_app_password
FRONTEND_URL=http://localhost:5173


# Run backend
cd backend
npm start

# Run frontend
cd ../frontend
npm run dev
```

---

## Usage Guide

* Sign up for a new account
* Create a trip and add stops and activities
* Review itinerary in calendar/timeline view
* Check budget estimates and adjust plans
* Share itinerary if desired

---

## Screenshots

*(Add relevant screenshots here)*

1. Login Page
2. Dashboard View
3. Itinerary Builder
4. Budget Breakdown
5. Public Itinerary View

---

## Demo Video

*(Add link to demo video here, e.g., YouTube or Loom)*

---

## Database Schema

**Key Tables:**

* **Users** – Stores authentication and profile data
* **Trips** – Trip metadata (name, description, dates)
* **Stops** – Each city or location in a trip
* **Activities** – Activities linked to stops
* **Budgets** – Estimated costs per trip

---

## Future Enhancements

* AI-based itinerary suggestions based on preferences
* Real-time currency conversion for budget
* Integration with Google Maps & booking APIs
* Offline access to saved trips
* Collaborative trip editing with multiple users

---

## Contributing

We welcome contributions to improve GlobeTrotter. Please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes and push to your fork
4. Create a pull request with a clear description

---

## License

This project is licensed under the MIT License.
