import axios from "axios";
import Weather from "../models/Weather.js";
import dotenv from "dotenv";
// import { fetchWeather } from "../utils/fetchWeather.js";

dotenv.config();

const API_KEY = process.env.OPENWEATHERMAP_KEY;

const LOCATIONS = ["Delhi", "Moscow", "Paris", "New York", "Sydney", "Riyadh"];

export const fetchWeatherData = async (location) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
    );
    // console.log(response);

    const weatherData = {
      location: response.data.name,
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].main,
      icon: response.data.weather[0].icon,
      date: new Date(),
      windSpeed: response.data.wind.speed,
      pressure: response.data.main.pressure,
    };

    return weatherData;
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error.message}`);
  }
};

export const getWeather = async (req, res) => {
  try {
    const { location } = req.query;

    if (!LOCATIONS.includes(location)) {
      return res.status(400).json({
        error:
          "Invalid location. Available locations: Delhi, Moscow, Paris, New York, Sydney, Riyadh",
      });
    }

    const weatherData = await fetchWeatherData(location);
    const newWeather = new Weather(weatherData);
    await newWeather.save();

    res.status(200).json(newWeather);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { from, to, location } = req.query;

    if (!from || !to) {
      return res
        .status(400)
        .json({ error: "Both from and to dates are required" });
    }

    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const diffDays = (toDate - fromDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 30) {
      return res.status(400).json({ error: "Maximum date range is 30 days" });
    }

    let query = { date: { $gte: fromDate, $lte: toDate } };
    if (location && LOCATIONS.includes(location)) {
      query.location = location;
    }

    const records = await Weather.find(query).sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* import Weather from "../models/Weather.js";
import { fetchWeather } from "../utils/fetchWeather.";

export const getWeather = async (req, res) => {
  try {
    const { location } = req.query;
    const weatherData = await fetchWeather(location);
    const newWeather = new Weather(weatherData);
    await newWeather.save();
    res.status(200).json(newWeather);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch weather" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { from, to, location } = req.query;
    let query = {};
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      const diffDays = (toDate - fromDate) / (1000 * 60 * 60 * 24);
      if (diffDays > 30) {
        return res.status(400).json({ error: "Max range is 30 days" });
      }
      query.date = { $gte: fromDate, $lte: toDate };
    }
    if (location) query.location = location;
    const records = await Weather.find(query).sort({ date: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: "Failed to get history" });
  }
};
 */
