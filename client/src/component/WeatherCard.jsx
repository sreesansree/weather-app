import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather, fetchHistory } from "../redux/weatherSlice";
import { WiDaySunny, WiCloudy, WiSunset, WiDayCloudy } from "react-icons/wi";
import dayjs from "dayjs";

const LOCATIONS = ["Delhi", "Moscow", "Paris", "New York", "Sydney", "Riyadh"];

const WeatherApp = () => {
  const dispatch = useDispatch();
  const { current, history, loading, error } = useSelector(
    (state) => state.weather
  );

  const [location, setLocation] = useState("Delhi");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    dispatch(fetchWeather(location));
  }, [dispatch, location]);

  const handleHistoryFetch = () => {
    const fromDate = dayjs(from);
    const toDate = dayjs(to);
    const diff = toDate.diff(fromDate, "day");

    if (!from || !to) {
      setDateError("Both dates are required.");
      return;
    }
    if (diff < 0) {
      setDateError("From date must be before To date.");
      return;
    }
    if (diff > 30) {
      setDateError("Date range must not exceed 30 days.");
      return;
    }

    setDateError("");
    dispatch(fetchHistory({ from, to, location }));
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-start p-4 gap-6"
      style={{ backgroundImage: `url('/bg.png')` }}
    >
      {/* Controls */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 justify-center items-center">
        <select
          className="p-2 rounded bg-gray-700 text-white"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="p-2 rounded text-white"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="p-2 rounded text-white"
        />
        <button
          onClick={handleHistoryFetch}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Get History
        </button>
      </div>
      {dateError && <p className="text-red-500">{dateError}</p>}

      {/* Weather Display */}
      {loading ? (
        <div className="text-white text-xl">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-xl">{error}</div>
      ) : current ? (
        <div className="w-full max-w-4xl bg-white/20 backdrop-blur-md rounded-3xl p-4 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          {/* Left Weather Box */}
          <div className="bg-[#FFD7A3] w-full md:w-1/2 rounded-3xl p-6 flex flex-col items-center text-center text-[#FF6600]">
            <div className="text-lg font-semibold mb-2">
              Today <span className="text-[#FF6600]">▼</span>
            </div>
            
            <WiDaySunny size={80} className="text-[#FF6600]" />
            <div className="text-6xl font-bold mt-2">
              {Math.round(current.temp)}°
            </div>
            <div className="text-xl font-semibold mt-1">
              {current.condition}
            </div>
            <div className="text-sm text-[#FF6600] mt-2">
              {current.city}, {current.region}
            </div>
            <div className="text-sm text-[#FF6600]">{current.date}</div>
            <div className="text-sm text-[#FF6600] mt-2">
              Feels like {Math.round(current.feels_like)} | Sunset{" "}
              {current.sunset || "N/A"}
            </div>
          </div>

          {/* Right Hourly Forecast & Text */}
          <div className="flex flex-col gap-4 w-full md:w-1/2">
            {/* Hourly Forecast */}
            <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 grid grid-cols-5 md:grid-cols-10 text-white text-sm text-center">
              {Array.isArray(current.hourly) && current.hourly.length > 0 ? (
                current.hourly.map((item, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div>{item.time}</div>
                    <WiCloudy size={24} className="mt-1" />
                    <div>{Math.round(item.temp)}°</div>
                  </div>
                ))
              ) : (
                <div className="grid grid-cols-6 gap-10 w-full px-4">
                  {[
                    { time: "Now", temp: 32, icon: <WiDaySunny size={24} /> },
                    { time: "2:00", temp: 31, icon: <WiDaySunny size={24} /> },
                    { time: "3:00", temp: 30, icon: <WiDaySunny size={24} /> },
                    {
                      time: "4:00",
                      temp: 29,
                      icon: <WiDayCloudy size={24} />,
                    },
                    {
                      time: "5:00",
                      temp: 28,
                      icon: <WiDayCloudy size={24} />,
                    },
                    { time: "6:00", temp: 27, icon: <WiSunset size={24} /> },
                  ].map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-sm text-gray-600">{item.time}</div>
                      <div className="mt-1">{item.icon}</div>
                      <div className="text-sm font-medium">{item.temp}°</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 text-gray-50 rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">Random Text</h2>
              <p>
                Improve him believe opinion offered met and,
                <br />
                cheered forbade, friendly as stronger speedily by recurred.
                <br />
                Son interest wandered sir addition and say, Manners beloved
                affixed picture men ask.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-white text-xl">No weather data available.</div>
      )}

      {/* History Table */}
      {history.length > 0 && (
        <div className="mt-6 w-full max-w-4xl bg-white/20 backdrop-blur-md rounded-2xl p-4 text-white overflow-auto">
          <h3 className="text-xl font-semibold mb-2">Historical Weather</h3>
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="p-2">Date</th>
                <th className="p-2">Location</th>
                <th className="p-2">Temp</th>
                <th className="p-2">Feels Like</th>
                <th className="p-2">Humidity</th>
                <th className="p-2">Condition</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-600">
                  <td className="p-2">
                    {dayjs(item.date).format("YYYY-MM-DD")}
                  </td>
                  <td className="p-2">{item.location}</td>
                  <td className="p-2">{item.temperature}°C</td>
                  <td className="p-2">{item.feels_like}°C</td>
                  <td className="p-2">{item.humidity}%</td>
                  <td className="p-2">{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;

// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchWeather } from "../redux/weatherSlice"; // Adjust path as needed
// import { WiDaySunny, WiCloudy } from "react-icons/wi";

// const WeatherApp = () => {
//   const dispatch = useDispatch();
//   const { current, loading, error } = useSelector((state) => state.weather);
//   console.log(current);
//   useEffect(() => {
//     dispatch(fetchWeather("Delhi")); // Replace or make dynamic
//   }, [dispatch]);

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
//       style={{ backgroundImage: `url('/bg.png')` }}
//     >
//       {loading ? (
//         <div className="text-white text-xl">Loading...</div>
//       ) : error ? (
//         <div className="text-red-500 text-xl">{error}</div>
//       ) : current ? (
//         <div className="w-full max-w-4xl bg-white/20 backdrop-blur-md rounded-3xl p-4 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
//           {/* Left Weather Box */}
//           <div className="bg-[#FFD7A3] w-full md:w-1/2 rounded-3xl p-6 flex flex-col items-center text-center text-[#FF6600]">
//             <div className="text-lg font-semibold mb-2">
//               Today <span className="text-[#FF6600]">▼</span>
//             </div>
//             <WiDaySunny size={80} className="text-[#FF6600]" />
//             <div className="text-6xl font-bold mt-2">
//               {Math.round(current.temp)}°
//             </div>
//             <div className="text-xl font-semibold mt-1">
//               {current.condition}
//             </div>
//             <div className="text-sm text-[#FF6600] mt-2">
//               {current.city}, {current.region}
//             </div>
//             <div className="text-sm text-[#FF6600]">{current.date}</div>
//             <div className="text-sm text-[#FF6600] mt-2">
//               Feels like {Math.round(current.feels_like)} | Sunset{" "}
//               {current.sunset}
//             </div>
//           </div>

//           {/* Right Hourly Forecast & Text */}
//           <div className="flex flex-col gap-4 w-full md:w-1/2">
//             {/* Hourly Forecast */}
//             <div className="bg-white/30 backdrop-blur-md rounded-2xl p-4 grid grid-cols-5 md:grid-cols-10 text-white text-sm text-center">
//               {Array.isArray(current.hourly) && current.hourly.length > 0 ? (
//                 current.hourly.map((item, index) => (
//                   <div key={index} className="flex flex-col items-center">
//                     <div>{item.time}</div>
//                     <WiCloudy size={24} className="mt-1" />
//                     <div>{Math.round(item.temp)}°</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="col-span-full text-sm text-center">
//                   No hourly data available
//                 </div>
//               )}
//             </div>

//             {/* Summary Text */}
//             {/* <div className="text-white">
//               <h3 className="font-semibold text-lg mb-1">Weather Summary</h3>
//               <p className="text-sm leading-relaxed">{current.summary}</p>
//             </div> */}
//             {/* Random Text Section */}
//             <div className="mt-8 text-gray-50  rounded-xl p-6 shadow-lg ">
//               <h2 className="text-xl font-bold mb-4">Random Text</h2>
//               <p className="">
//                 Improve him believe opinion offered met and, and
//                 <br />
//                 cheered forbade, friendly as stronger speedily by
//                 <br />
//                 recurred. Son interest wandered sir addition and say,
//                 <br />
//                 Manners beloved affixed picture men ask.
//               </p>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="text-white text-xl">No weather data available.</div>
//       )}
//     </div>
//   );
// };

// export default WeatherApp;
