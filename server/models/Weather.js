// import mongoose from "mongoose";

// const WeatherSchema = new mongoose.Schema({
//   location: String,
//   temperature: Number,
//   description: String,
//   icon: String,
//   date: Date,
// });

// const Weather = mongoose.model("Weather", WeatherSchema);
// export default Weather;

import mongoose from "mongoose";

const weatherSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  temperature: {
    type: Number,
    required: true,
  },
  feels_like: {
    type: Number,
    required: true,
  },
  humidity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  windSpeed: {
    type: Number,
    required: true,
  },
  pressure: {
    type: Number,
    required: true,
  },
  // Optional: for forecast
  isForecast: {
    type: Boolean,
    default: false,
  },
  forecastTime: {
    type: Date, // for hourly forecast records
  },
});

const Weather = mongoose.model("Weather", weatherSchema);

export default Weather;
