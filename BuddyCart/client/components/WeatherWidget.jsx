import { useEffect, useState } from "react";
import { WMO_MAP } from "./wmo";

export default function WeatherWidget({ onWeatherChange }) {
  const CITIES = [
    { name: "Beijing, CN", lat: 39.9042, lon: 116.4074 },
    { name: "Shanghai, CN", lat: 31.2304, lon: 121.4737 },
    { name: "Tokyo, JP", lat: 35.6762, lon: 139.6503 },
    { name: "Seoul, KR", lat: 37.5665, lon: 126.978 },
    { name: "Singapore, SG", lat: 1.3521, lon: 103.8198 },
    { name: "Sydney, AU", lat: -33.8688, lon: 151.2093 },
    { name: "Mumbai, IN", lat: 19.076, lon: 72.8777 },
    { name: "Dubai, AE", lat: 25.2048, lon: 55.2708 },
    { name: "Moscow, RU", lat: 55.7558, lon: 37.6173 },
    { name: "Cairo, EG", lat: 30.0444, lon: 31.2357 },
    { name: "Johannesburg, ZA", lat: -26.2041, lon: 28.0473 },
    { name: "London, UK", lat: 51.5074, lon: -0.1278 },
    { name: "Paris, FR", lat: 48.8566, lon: 2.3522 },
    { name: "Berlin, DE", lat: 52.52, lon: 13.405 },
    { name: "Madrid, ES", lat: 40.4168, lon: -3.7038 },
    { name: "Rome, IT", lat: 41.9028, lon: 12.4964 },
    { name: "New York, US", lat: 40.7128, lon: -74.006 },
    { name: "Los Angeles, US", lat: 34.0522, lon: -118.2437 },
    { name: "Toronto, CA", lat: 43.6532, lon: -79.3832 },
    { name: "São Paulo, BR", lat: -23.5505, lon: -46.6333 },
    { name: "Mexico City, MX", lat: 19.4326, lon: -99.1332 },
    { name: "Buenos Aires, AR", lat: -34.6037, lon: -58.3816 },
  ];

  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [data, setData] = useState(null);


  useEffect(() => {
    const { lat, lon } = selectedCity;
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&daily=weather_code` +
      `&hourly=temperature_2m,apparent_temperature` +
      `&timezone=auto`;

    fetch(url)
      .then((r) => r.json())
      .then((result) => {
        setData(result);
        
        if (onWeatherChange && result?.hourly) {
          const temp = result.hourly.temperature_2m[0];
          const feelsLike = result.hourly.apparent_temperature[0];
          onWeatherChange({ temp, feelsLike, city: selectedCity.name });
        }
      })
      .catch(console.error);
  }, [selectedCity]);

  if (!data) return <div>Loading…</div>;

  const codeToday = data.daily.weather_code[0];
  const weather = WMO_MAP[codeToday] ?? {
    text: `Unknown (${codeToday})`,
    emoji: "❓",
  };

  return (
    <div style={{ padding: "10px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <label htmlFor="city" style={{ fontWeight: "600" }}>
          🌍 Select a city:
        </label>
        <select
          id="city"
          value={selectedCity.name}
          onChange={(e) =>
            setSelectedCity(CITIES.find((c) => c.name === e.target.value))
          }
          style={{ padding: "6px 8px" }}
        >
          {CITIES.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "10px" }}>
        <h3>
          {selectedCity.name}: {weather.emoji} {weather.text}
        </h3>
        <p>Current temperature: {data.hourly.temperature_2m[0]} °C</p>
        <p>Feels like: {data.hourly.apparent_temperature[0]} °C</p>
      </div>
    </div>
  );
}
