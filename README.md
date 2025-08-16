
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
* Google OAuth integration
* Forgot password functionality
* User profile management and preferences

### 2. Trip Creation & Management

* Create multi-city itineraries with start and end dates
* Add detailed descriptions and cover photos
* Edit, view, or delete trips

### 3. AI-Powered Itinerary Builder

* AI-generated day-wise and time-wise itineraries based on trip description
* Modify, accept, or manually add activities
* Interactive city/activity ordering

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

### 7. Admin Dashboard

* Manage users and platform data
* View analytics, top cities, and most popular activities
* Add cities and activities to assist users

---

## Tech Stack

| Category           | Technologies Used                                          |
| ------------------ | ---------------------------------------------------------- |
| **Frontend**       | React.js, Vite, Tailwind CSS, Material UI, Recharts        |
| **Backend**        | Node.js, Express.js                                        |
| **Database**       | MongoDB (Mongoose ODM)                                     |
| **Authentication** | JWT (JSON Web Tokens), Google OAuth 2.0                    |
| **Security**       | Bcrypt password hashing, Environment variables with dotenv |
| **File Storage**   | Cloudinary                                                 |
| **Email Service**  | Gmail SMTP                                                 |
| **Deployment**     | Vercel (Frontend), Render (Backend)                        |
| **AI Integration** | Custom AI itinerary generation pipeline                    |

---

## System Architecture

* **Client Layer:** Responsive web interface for trip planning and viewing itineraries
* **API Layer:** RESTful endpoints handling CRUD operations, AI itinerary generation, and authentication
* **Database Layer:** MongoDB storing users, trips, cities, activities, and budget data
<img width="2852" height="3491" alt="diagram-export-8-12-2025-9_13_31-AM" src="https://github.com/user-attachments/assets/6884feab-95d6-4dd9-a659-a1c4b95a822e" />

---

## User Flow 

```mermaid
flowchart LR
    %% ===== USER FLOW =====
    subgraph UserFlow["User Journey with AI"]
        UA["User visits GlobeTrotter"] --> UB["Registers or Logs in"]
        UB -->|"Custom Login/Signup or Google Auth"| UC["Dashboard"]
        UC --> UD["Create New Trip"]
        UD --> UE["Enter trip details: Name, Dates, Description"]
        UE --> UF["AI generates regional & custom itinerary based on description and previous trips"]
        UF --> UG{"User Action"}
        UG -->|"Modify"| UH["User edits itinerary manually with AI suggestions"]
        UG -->|"Accept"| UI["Save itinerary directly"]
        UH --> UI
        UI --> UJ["View Saved Itinerary with AI recommendations for nearby attractions"]
        UJ --> UK["Access other features: Ongoing, Upcoming, Past Trips (AI highlights key experiences)"]
        UK --> UC
        UC --> UL["Book Now button – AI syncs best travel dates & deals with user preferences"]
    end

    %% ===== ADMIN FLOW =====
    subgraph AdminFlow["Admin Journey with AI"]
        AA["Admin logs into Admin Panel"]
        AA --> AB["Manage Users with AI-driven engagement insights"]
        AA --> AC["View Analytics: AI summarizes usage trends"]
        AA --> AD["Add Cities and Activities"]
        AD --> AE["AI suggests cities & activities based on recommendations, popularity & cost index"]
        AE --> AF["Publish to user dashboards"]
    end

    %% Aligning side-by-side
    UserFlow --- AdminFlow

```

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

# Setup environment variables

# FRONTEND (.env)
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# BACKEND (.env)
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
npm run dev

# Run frontend
cd ../frontend
npm run dev
```

---

## Usage Guide

1. Register or log in using email/password or Google Auth
2. Create a trip by adding name, dates, and description
3. AI generates an itinerary which you can accept or modify
4. Save your itinerary and view it in timeline or calendar format
5. Check budget breakdown and adjust activities as needed
6. Share trip publicly or keep private

---

## Screenshots

<table>
  <tr>
    <td>
      <h3>1. Login Page</h3>
      <img src="https://github.com/user-attachments/assets/cb530455-af75-4489-9274-5cf14dc703ca" alt="Login Page" width="300"/>
    </td>
    <td>
      <h3>2. Dashboard</h3>
      <img src="https://github.com/user-attachments/assets/358457c8-4764-479b-9104-1366f1989f67" alt="Dashboard" width="300"/>
    </td>
    <td>
      <h3>3. AI Itinerary Builder</h3>
      <img src="https://github.com/user-attachments/assets/a09c8922-b7a8-463c-9a7b-c66ed67a613b" alt="AI Itinerary Builder" width="300"/>
    </td>
  </tr>
  <tr>
    <td>
      <h3>4. Budget Overview</h3>
      <img width="300" alt="image" src="https://github.com/user-attachments/assets/968c1ba4-cc71-4c8d-955e-f6cde33ff017" />
    </td>
    <td>
      <h3>5. Admin Panel</h3>
      <img src="https://github.com/user-attachments/assets/ac3b4982-725c-41e1-afcb-ae3b5fb6df6d" alt="Admin Panel" width="300"/>
    </td>
    <td>
       <h3>6. Community Section</h3>
      <img width="300" alt="Community" src="https://github.com/user-attachments/assets/c1787b5c-2cb8-4f51-8d1e-f7f16eb7a5fd" />
    </td>
  </tr>
  <tr>
    <td>
      <h3>7. Admin Activity Management</h3>
      <img width="300"  alt="image" src="https://github.com/user-attachments/assets/d1bd0b82-a272-4658-94f8-54dce70f6e19" />
    </td>
    <td>
      <h3>8. Activity/City Search</h3>
      <img width="300"  alt="image" src="https://github.com/user-attachments/assets/9c916aa2-0ab3-4b6b-af2d-0461c297589f" />
    </td>
    <td>
       <h3>9. Calendar View</h3>
      <img width="300" alt="image" src="https://github.com/user-attachments/assets/9125dd2b-beb5-4a2f-94da-5d7173d7cb64" />
    </td>
  </tr>
</table>



   

---

## Demo Video

*(Add link here)*

---

## Database Schema

**Collections:**

* **Users** – Authentication & profile data
* **Trips** – Trip details (name, dates, description)
* **Stops** – Cities included in the trip
* **Activities** – Activities linked to stops
* **Budgets** – Estimated expenses

---

## Future Enhancements

* Real-time currency conversion
* Collaborative trip planning with multiple users
* Integration with Google Maps & Booking APIs
* Offline trip access
* AI-powered recommendations for best travel seasons

---

## Contributing

We welcome contributions.

1. Fork this repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Create a pull request

---

## License

This project is licensed under the MIT License.

