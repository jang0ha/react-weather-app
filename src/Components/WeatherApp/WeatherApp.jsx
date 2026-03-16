import React, { useState } from "react";
import "./WeatherApp.css";
import searchIcon from "../../assets/search.svg";

import cloud from "../../assets/cloud.png";
import humidity from "../../assets/humidity.png";
import sunny from "../../assets/sunny.png";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  const fetchWeather = async () => {
    if (!city.trim()) {
      alert("도시 이름을 입력하세요");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city,
        )}&appid=${apiKey}&units=metric&lang=kr`,
      );

      if (!response.ok) {
        // API 요청이 실패한 경우
        const err = await response.json();
        throw new Error(
          err.message || "날씨 데이터를 불러오는 중 오류가 발생했습니다.",
        );
      }

      const data = await response.json();
      setWeather(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const temperature = weather?.main?.temp;
  const humidityValue = weather?.main?.humidity;
  const cloudiness = weather?.clouds?.all;
  const cityName = weather?.name;
  const weatherIconCode = weather?.weather?.[0]?.icon;

  const weatherImageUrl = weatherIconCode
    ? `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`
    : sunny;

  return (
    <section className="container">
      <div className="top-bar">
        <input
          type="text"
          className="search-input"
          placeholder="도시 이름을 입력하세요"
          value={city}
          onChange={(event) => setCity(event.target.value)}
        />
        <button
          className="search-btn"
          onClick={fetchWeather}
          disabled={loading}
        >
          <img src={searchIcon} alt="Search" className="search-icon" />
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {!error && weather && (
        <article className="weather-wrap">
          <div className="main-data">
            <div className="weather-image">
              <img
                src={weatherImageUrl}
                alt={weather?.weather?.[0]?.description || "Weather"}
              />
            </div>
            <p className="temperature">
              {temperature ? `${Math.round(temperature)}°C` : "--"}
            </p>
            <p className="city-name">{cityName || "도시를 검색하세요"}</p>
          </div>

          <div className="sub-data">
            <img src={humidity} alt="습도" />
            <div>
              <p>습도</p>
              <p>{humidityValue != null ? `${humidityValue}%` : "--"}</p>
            </div>
          </div>
          <div className="sub-data">
            <img src={cloud} alt="구름" />
            <div>
              <p>구름</p>
              <p>{cloudiness != null ? `${cloudiness}%` : "--"}</p>
            </div>
          </div>
        </article>
      )}

      {loading && <p className="loading">로딩 중…</p>}
    </section>
  );
};

export default WeatherApp;
