# Weather Dashboard

A modern full-stack Weather Dashboard that enables users to securely register, log in, manage their cities, and view real-time weather data enhanced with intelligent AI-style insights.
This project demonstrates secure authentication, protected routes, REST API integration, database design, and responsive UI development using modern web technologies.

# Live Features

🔐 User Registration & Login (JWT Authentication)
🔒 Protected Routes with Middleware
🌍 Add / Delete / Favorite Cities
📡 Real-Time Weather Data (OpenWeather API)
🤖 AI-Style Dynamic Weather Insight
🗄 User-Specific Data Isolation (MongoDB)
🎨 Modern Responsive UI (Tailwind CSS)
🛡 Secure Environment Variable Handling

# 🛠 Tech Stack

# Frontend
Next.js (App Router)
React
Tailwind CSS

# Backend
Node.js
Express.js
MongoDB Atlas
Mongoose

# APIs
OpenWeather API (for real-time weather data)

# 📂 Project Structure
weather-app/
│
├── client/        # Next.js frontend
│
├── server/        # Express backend
│   ├── models/    # Mongoose models
│   ├── middleware/# Auth middleware
│   └── server.js
│
└── README.md

# 🔐 Authentication Flow

User registers with email and password
Password is hashed using bcrypt
On login, JWT token is generated
Token is stored in localStorage
Protected routes verify token before granting access
This ensures secure user authentication and data isolation.

# 🌍 City Management

Users can add cities
Duplicate city prevention implemented
Toggle favorite status
Delete cities
Each city is stored with userId reference

# 🌦 Weather Integration

Weather data is fetched from the OpenWeather API:
Temperature (°C)
Weather condition
Humidity
The backend handles API calls securely using environment variables.

# 🤖 AI-Style Weather Insight

The application includes a dynamic weather insight feature that:
Analyzes temperature and weather condition
Generates a short human-style insight
Enhances user experience beyond static weather data
This demonstrates intelligent backend processing logic.

# ⚙️ Environment Variables

Create a .env file inside the server folder:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
WEATHER_API_KEY=your_openweather_api_key
OPENAI_API_KEY=optional_if_using_real_ai

⚠ Never commit .env to GitHub.

▶️ How To Run Locally
1️⃣ Clone Repository
git clone <your-repo-link>
cd weather-app
2️⃣ Backend Setup
cd server
npm install
node server.js

# Runs on:

http://localhost:5000
3️⃣ Frontend Setup
cd client
npm install
npm run dev

# Runs on:

http://localhost:3000
📡 API Endpoints
Authentication

POST /register

POST /login

GET /profile

# Cities

POST /cities

GET /cities

PATCH /cities/:id/favorite

DELETE /cities/:id

# Weather

GET /weather/:city

AI Insight

GET /ai-insight/:city

# 🏗 Application Architecture
Frontend (Next.js)
        ↓
Backend API (Express)
        ↓
MongoDB Atlas (User Data)
        ↓
OpenWeather API (Live Weather Data)

# 🔒 Security Implemented

Password hashing (bcrypt)

JWT-based authentication
Protected API routes
User-based data isolation
Duplicate city prevention
Secure environment variables

# 📈 Future Improvements

5-Day Forecast Integration

Dark Mode
Loading Skeleton Animations
Deployment (Vercel + Render)
Real AI API Integration
Email Verification System

# 🎯 Learning Outcomes

This project demonstrates:
Full-stack application development
Secure authentication implementation
REST API design
Third-party API integration
Database modeling with Mongoose
Responsive UI design
Clean project structure and architecture

📜 License

This project is for educational and demonstration purposes.




📂 Project Structure
