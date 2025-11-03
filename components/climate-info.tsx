"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Cloud, Droplets, Wind, Thermometer, AlertCircle } from "lucide-react";
import { useLanguage } from "../providers/language-provider";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload[0]) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {label}
        </p>
        <p className="text-sm text-red-600 font-medium">{payload[0].value}°C</p>
      </div>
    );
  }
  return null;
};

export default function ClimateInfo() {
  const { language, t } = useLanguage();
  const [climateData, setClimateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<string>("Dhaka");

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${location}&days=7&aqi=no&alerts=no`
        );
        const data = await res.json();

        if (data && data.current && data.forecast) {
          const lat = data.location.lat;
          const lon = data.location.lon;

          const pollutionRes = await fetch(
            `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
          );
          const pollutionData = await pollutionRes.json();

          console.log("==========>", pollutionData);

          let aqi = null;
          let qualitativeName = null;
          let components = null;

          if (pollutionData?.list?.length > 0) {
            aqi = pollutionData.list[0].main.aqi;
            qualitativeName = [
              "",
              "Good",
              "Fair",
              "Moderate",
              "Poor",
              "Very Poor",
            ][aqi];
            components = pollutionData.list[0].components;
          }

          const forecast = data.forecast.forecastday.map((day: any) => ({
            day: new Date(day.date).toLocaleDateString("en-US", {
              weekday: "short",
            }),
            temp: Math.round(day.day.avgtemp_c),
          }));

          setClimateData({
            temperature: data.current.temp_c,
            condition: data.current.condition.text,
            humidity: data.current.humidity,
            windSpeed: data.current.wind_kph,
            precipitation: data.current.precip_mm,
            feelsLike: data.current.feelslike_c,
            forecast,
            aqi,
            qualitativeName,
            components,
          });
        } else {
          setClimateData(null);
        }
      } catch (error) {
        console.error("API error:", error);
        setClimateData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const handleLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLocation(event.target.value);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <span className="border-l-4 border-red-600 pl-2">
              {t("widget.climate")} ({location})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!climateData) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            No data available. Try another location.
          </p>
        </CardContent>
      </Card>
    );
  }

  const aqiLevels = [
    {
      name: "Good",
      index: 1,
      color: "bg-green-500",
      text: "text-green-900",
      so2: "[0; 20)",
      no2: "[0; 40)",
      pm10: "[0; 20)",
      pm25: "[0; 10)",
      o3: "[0; 60)",
      co: "[0; 4400)",
    },
    {
      name: "Fair",
      index: 2,
      color: "bg-yellow-400",
      text: "text-yellow-900",
      so2: "[20; 80)",
      no2: "[40; 70)",
      pm10: "[20; 50)",
      pm25: "[10; 25)",
      o3: "[60; 100)",
      co: "[4400; 9400)",
    },
    {
      name: "Moderate",
      index: 3,
      color: "bg-orange-400",
      text: "text-orange-900",
      so2: "[80; 250)",
      no2: "[70; 150)",
      pm10: "[50; 100)",
      pm25: "[25; 50)",
      o3: "[100; 140)",
      co: "[9400; 12400)",
    },
    {
      name: "Poor",
      index: 4,
      color: "bg-red-500",
      text: "text-red-900",
      so2: "[250; 350)",
      no2: "[150; 200)",
      pm10: "[100; 200)",
      pm25: "[50; 75)",
      o3: "[140; 180)",
      co: "[12400; 15400)",
    },
    {
      name: "Very Poor",
      index: 5,
      color: "bg-purple-600",
      text: "text-purple-50",
      so2: "≥350",
      no2: "≥200",
      pm10: "≥200",
      pm25: "≥75",
      o3: "≥180",
      co: "≥15400",
    },
  ];

  const getAqiBadge = (aqi: number) => {
    const level = aqiLevels.find((l) => l.index === aqi);
    if (!level) return null;
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${level.color} ${level.text}`}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
        {level.name} ({aqi})
      </div>
    );
  };

  // Helper to format pollutant value and unit
  const formatPollutant = (key: string, value: number) => {
    if (key === "co") {
      return `${Number(value).toFixed(0)} µg/m³`;
    }
    return `${Number(value).toFixed(1)} µg/m³`;
  };

  // Helper to get pollutant label
  const getPollutantLabel = (key: string) => {
    switch (key) {
      case "pm2_5":
        return "PM₂.₅";
      case "pm10":
        return "PM₁₀";
      case "co":
        return "CO";
      case "o3":
        return "O₃";
      default:
        return key.toUpperCase();
    }
  };

  // Filter to show only requested pollutants
  const displayedPollutants = climateData.components
    ? Object.entries(climateData.components)
        .filter(([key]) => ["pm2_5", "pm10", "co", "o3"].includes(key))
        .map(([key, value]) => ({
          key,
          label: getPollutantLabel(key),
          value: Number(value),
          formatted: formatPollutant(key, Number(value)),
        }))
    : [];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            <span className="border-l-4 border-red-600 pl-2 font-bold">
              {t("widget.climate")} • {location}
            </span>
          </CardTitle>
          {climateData.aqi && (
            <div className="flex items-center gap-2">
              <Cloud className="w-4 h-4 text-gray-600" />
              {getAqiBadge(climateData.aqi)}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-4">
        {/* Current Weather Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <Thermometer className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-xs text-muted-foreground">Temp</p>
              <p className="font-semibold">{climateData.temperature}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-cyan-50 dark:bg-cyan-950/20 rounded-lg">
            <Droplets className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-semibold">{climateData.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg">
            <Wind className="w-4 h-4 text-emerald-600" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="font-semibold">{climateData.windSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <Cloud className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-xs text-muted-foreground">Feels Like</p>
              <p className="font-semibold">{climateData.feelsLike}°C</p>
            </div>
          </div>
        </div>

        {/* Enhanced Temperature Forecast Chart */}
        <div className="relative">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            7-Day Temperature Forecast
          </h4>
          <div className="h-56 -mx-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={climateData.forecast}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12, fill: "#666" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#666" }}
                  axisLine={false}
                  tickLine={false}
                  domain={[
                    (dataMin: number) => Math.floor(dataMin - 1),
                    (dataMax: number) => Math.ceil(dataMax + 1),
                  ]}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ strokeDasharray: "5 5" }}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  fill="url(#tempGradient)"
                  dot={{
                    fill: "#ef4444",
                    strokeWidth: 2,
                    r: 5,
                    fillOpacity: 1,
                  }}
                  activeDot={{
                    r: 7,
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Air Pollutants Focus */}
        {displayedPollutants.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              Current Air Pollutants (μg/m³)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {displayedPollutants.map(({ label, formatted }) => (
                <div
                  key={label}
                  className="flex flex-col items-center p-3 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border border-border hover:shadow-sm transition-all"
                >
                  <span className="font-medium text-muted-foreground mb-1">
                    {label}
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatted}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AQI Scale Table */}
        <div>
          <h4 className="text-sm font-semibold mb-2">AQI Scale Reference</h4>
          <div className="overflow-x-auto text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left py-1.5 font-medium">Level</th>
                  <th className="text-center py-1.5 font-medium">AQI</th>
                  <th className="text-center py-1.5 font-medium">PM₂.₅</th>
                  <th className="text-center py-1.5 font-medium">PM₁₀</th>
                  <th className="text-center py-1.5 font-medium">O₃</th>
                </tr>
              </thead>
              <tbody>
                {aqiLevels.map((level) => (
                  <tr
                    key={level.index}
                    className={`border-b dark:border-gray-700 transition-colors ${
                      climateData.aqi === level.index
                        ? "bg-muted/70 font-medium"
                        : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="py-1.5 flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${level.color}`}
                      ></div>
                      {level.name}
                    </td>
                    <td className="text-center">{level.index}</td>
                    <td className="text-center text-muted-foreground">
                      {level.pm25}
                    </td>
                    <td className="text-center text-muted-foreground">
                      {level.pm10}
                    </td>
                    <td className="text-center text-muted-foreground">
                      {level.o3}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Data from WeatherAPI & OpenWeatherMap • Updated just now
        </p>
      </CardContent>
    </Card>
  );
}
