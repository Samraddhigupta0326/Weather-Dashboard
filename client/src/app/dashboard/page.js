"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function CityCard({ city, token, refresh }) {
  const [weather, setWeather] = useState(null);
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weatherRes = await fetch(
          `http://localhost:5000/weather/${city.cityName}`,
          { headers: { Authorization: token } }
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData);

        const aiRes = await fetch(
          `http://localhost:5000/ai-insight/${city.cityName}`,
          { headers: { Authorization: token } }
        );
        const aiData = await aiRes.json();
        setInsight(aiData.insight);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className={`relative bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl transition hover:shadow-2xl hover:-translate-y-1 border border-white/40 ${
        city.isFavorite ? "ring-2 ring-rose-300" : ""
      }`}
    >
      <button
        onClick={async () => {
          await fetch(
            `http://localhost:5000/cities/${city._id}/favorite`,
            {
              method: "PATCH",
              headers: { Authorization: token },
            }
          );
          refresh();
        }}
        className="absolute top-4 right-4 text-xl"
      >
        {city.isFavorite ? "⭐" : "☆"}
      </button>

      <h2 className="text-xl font-semibold capitalize text-gray-800 mb-2">
        {city.cityName}
      </h2>

      {weather ? (
        <>
          <p className="text-4xl font-bold text-indigo-500">
            {weather.temperature}°C
          </p>
          <p className="text-gray-500 capitalize mt-1">
            {weather.weather}
          </p>
        </>
      ) : (
        <p className="text-gray-400">Loading weather...</p>
      )}

      {insight ? (
        <p className="mt-4 text-sm text-gray-600 italic leading-relaxed">
          {insight}
        </p>
      ) : (
        <p className="mt-4 text-sm text-gray-300 italic">
          Generating insight...
        </p>
      )}

      <button
        onClick={async () => {
          await fetch(
            `http://localhost:5000/cities/${city._id}`,
            {
              method: "DELETE",
              headers: { Authorization: token },
            }
          );
          refresh();
        }}
        className="mt-5 text-sm text-rose-500 hover:text-rose-700 transition"
      >
        Remove
      </button>
    </div>
  );
}

export default function Dashboard() {
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState("");
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchCities();
  }, []);

  const fetchCities = async () => {
    const res = await fetch("http://localhost:5000/cities", {
      headers: { Authorization: token },
    });
    const data = await res.json();
    setCities(data);
  };

  const addCity = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/cities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ cityName: newCity }),
    });

    setNewCity("");
    fetchCities();
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-indigo-100 to-sky-100 p-10">

      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-semibold text-gray-800">
          Your Weather Space
        </h1>
        <button
          onClick={logout}
          className="text-sm text-gray-600 hover:text-rose-500 transition"
        >
          Logout
        </button>
      </div>

      <form onSubmit={addCity} className="flex gap-4 mb-10">
        <input
          type="text"
          placeholder="Add a city..."
          className="flex-1 border border-gray-200 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 transition"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
        />

        <button className="bg-gradient-to-r from-rose-400 to-indigo-400 text-white px-6 rounded-xl font-medium hover:opacity-90 transition transform hover:scale-105">
          Add
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cities.map((city) => (
          <CityCard
            key={city._id}
            city={city}
            token={token}
            refresh={fetchCities}
          />
        ))}
      </div>
    </div>
  );
}