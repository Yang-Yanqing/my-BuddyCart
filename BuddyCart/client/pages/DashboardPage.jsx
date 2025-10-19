import React, { useMemo, useState } from "react";
import ListItem from "../components/ListItem";
import CloudinaryGallery from "../components/CloudinaryGallery";
import WeatherWidget from "../components/WeatherWidget";
import AmazonCard from "../components/AmazonCard";
import { useItems } from "../context/ItemsContext";

function pickByWeather(items, weather) {
  if (!Array.isArray(items) || items.length === 0) return [];
  const t = weather?.feelsLike ?? weather?.temp;

  if (t == null) return items.slice(0, 4);

  let keywords = [];
  if (t >= 20) {
    keywords = ["CK", "Eau", "Dior", "Chanel", "Perfume", "J'adore"];
  } else if (t >= 15) {
    keywords = ["Lipstick", "Mascara", "Eyeshadow", "Nail"];
  } else {
    keywords = ["Powder", "Mascara", "Coco", "Noir", "Lipstick"];
  }

  const hit = (s = "") =>
    keywords.some((k) => s.toLowerCase().includes(k.toLowerCase()));

  let list = items.filter((it) => hit(it.title));
  if (list.length < 4) {
    const extras = items.filter((it) => !hit(it.title));
    list = [...list, ...extras].slice(0, 4);
  } else {
    list = list.slice(0, 4);
  }
  return list;
}

const DashboardPage = () => {
  const [weatherInfo, setWeatherInfo] = useState({
    temp: null,
    feelsLike: null,
    city: "",
  });

  const { items } = useItems();

  const picks = useMemo(
    () => pickByWeather(items, weatherInfo),
    [items, weatherInfo]
  );

  return (
    <div style={{ padding: "20px" }}>
      {weatherInfo.temp !== null ? (
        <div
          style={{
            background: "#f7f7f7",
            padding: "10px 15px",
            borderRadius: "8px",
            marginBottom: "15px",
          }}
        >
          <strong>{weatherInfo.city}</strong> — Temperature: {weatherInfo.temp}{" "}
          °C, Feels like {weatherInfo.feelsLike} °C
        </div>
      ) : (
        <p style={{ color: "#666" }}>Select a city to see temperature.</p>
      )}
      <section style={{ margin: "20px 0" }}>
        <h2 style={{ marginBottom: 10 }}>Recommended for the weather</h2>

        <div className="amazon-cards amazon-cards--spotlight">
          {picks.map((p) => (
            <AmazonCard
              key={p.id}
              item={p}
              weather={weatherInfo}
              clickable
              className="amazon-card--spotlight"
            />
          ))}
        </div>
      </section>

      <CloudinaryGallery />

      <ListItem />
      <WeatherWidget onWeatherChange={setWeatherInfo} />
    </div>
  );
};

export default DashboardPage;
