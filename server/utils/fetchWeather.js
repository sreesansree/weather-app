import axios from "axios";

export const fetchWeather = async (location) => {
  const apiKey = process.env.OPENWEATHERMAP_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
  const res = await axios.get(url);
  return {
    location,
    temperature: res.data.main.temp,
    description: res.data.weather[0].description,
    icon: res.data.weather[0].icon,
    date: new Date(),
  };
  
};
