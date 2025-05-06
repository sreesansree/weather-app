# 🌦️ Weather App

A mobile-friendly full-stack weather application that fetches and displays real-time weather information using the OpenWeatherMap API. It also stores historical weather data in a MongoDB database and provides a filterable table for past weather records.

---

## 🚀 Features

- 🌍 Fetch current weather by city (Delhi, Moscow, Paris, New York, Sydney, Riyadh)
- 🌡️ Displays temperature, condition, icon, humidity, wind, pressure, and feels-like
- 🕓 Hourly forecast data
- 🕰️ Stores weather data historically
- 🔍 Filter history by location and date range (max 30 days)
- 📱 Responsive, modern UI (React + Tailwind CSS)
- ⚠️ Error handling and validation

---

## 🛠️ Tech Stack

**Frontend**:
- React.js + Vite
- Redux Toolkit
- Tailwind CSS
- React Icons

**Backend**:
- Node.js + Express
- MongoDB + Mongoose
- Axios
- dotenv

---

## 📦 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app

## 2. Backend Setup

- cd backend
- npm install

### Create a .env file in the backend/ folder:
- PORT=5000
- MONGODB_URI=your_mongodb_uri
- OPENWEATHERMAP_KEY=your_openweathermap_api_key

### Start the Backend Server:
 - npm run dev
 
Server will run on http://localhost:5000

---

## 3. Frontend Setup
 - cd frontend
 -  npm install


## Start the Frontend App:

npm run dev

## 📋 API Endpoints

| Method | Endpoint                                                           | Description                          |
| ------ | ------------------------------------------------------------------ | ------------------------------------ |
| GET    | `/weather?location=CityName`                                       | Fetch and store current weather      |
| GET    | `/weather/history?from=YYYY-MM-DD&to=YYYY-MM-DD&location=CityName` | Get filtered historical weather data |

Note: Replace CityName with one of the supported cities: Delhi, Moscow, Paris, New York, Sydney, Riyadh.

 ## 📌 Notes
 - Only selected cities are supported.

 - Maximum date range for history query is 30 days.

 - Backend automatically stores each current weather request in the database.

 - UI includes loading, error, and empty states.

 - Hourly forecast is dynamically displayed in the UI.