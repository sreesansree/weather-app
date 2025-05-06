import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchWeather = createAsyncThunk(
  "weather/fetch",
  async (location, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/weather?location=${location}`);
      console.log("Weather API Response:", res.data);
      return res.data;
    } catch (error) {
      console.error("Weather API Error:", error);
      return rejectWithValue(error.response?.data || { error: "Failed to fetch weather data" });
    }
  }
);

export const fetchHistory = createAsyncThunk(
  "weather/history",
  async ({ from, to, location }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/history?from=${from}&to=${to}${
          location ? `&location=${location}` : ""
        }`
      );
      console.log("History API Response:", res.data);
      return res.data;
    } catch (error) {
      console.error("History API Error:", error);
      return rejectWithValue(error.response?.data || { error: "Failed to fetch history data" });
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    current: null,
    history: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Weather Cases
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        
        // Transform API response to match frontend expectations
        state.current = {
          temp: payload.temperature,
          feels_like: payload.feels_like,
          condition: payload.description,
          city: payload.location,
          region: '', // Can be added if API provides it
          date: new Date(payload.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          sunset: 'N/A', // Can be added if API provides it
          icon: payload.icon,
          windSpeed: payload.windSpeed,
          pressure: payload.pressure,
          humidity: payload.humidity,
          summary: `Current weather in ${payload.location}: ${payload.description}. Temperature: ${Math.round(payload.temperature)}°C, feels like ${Math.round(payload.feels_like)}°C. Wind: ${payload.windSpeed} m/s. Humidity: ${payload.humidity}%.`,
          hourly: [] // Can be populated if API provides hourly data
        };
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch weather data";
      })
      
      // Fetch History Cases
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        // Transform history data if needed
        state.history = action.payload.map(item => ({
          date: new Date(item.date).toLocaleDateString(),
          temperature: item.temperature,
          condition: item.description,
          // Add other transformed fields as needed
        }));
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || "Failed to fetch history data";
      });
  },
});

export const { clearError } = weatherSlice.actions;
export default weatherSlice.reducer;