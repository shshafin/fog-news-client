"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Cloud, MapPin } from "lucide-react";
import { useLanguage } from "../providers/language-provider";

const AQI_LEVELS = [
  { index: 1, name: "Good", color: "bg-green-500", text: "text-green-900" },
  { index: 2, name: "Fair", color: "bg-yellow-400", text: "text-yellow-900" },
  {
    index: 3,
    name: "Moderate",
    color: "bg-orange-400",
    text: "text-orange-900",
  },
  { index: 4, name: "Poor", color: "bg-red-500", text: "text-red-900" },
  {
    index: 5,
    name: "Very Poor",
    color: "bg-purple-600",
    text: "text-purple-50",
  },
];

const AQI_BREAKPOINTS = [
  {
    name: "Good",
    pm25: "[0; 10)",
    pm10: "[0; 20)",
    o3: "[0; 60)",
    co: "[0; 4400)",
    so2: "[0; 20)",
    no2: "[0; 40)",
  },
  {
    name: "Fair",
    pm25: "[10; 25)",
    pm10: "[20; 50)",
    o3: "[60; 100)",
    co: "[4400; 9400)",
    so2: "[20; 80)",
    no2: "[40; 70)",
  },
  {
    name: "Moderate",
    pm25: "[25; 50)",
    pm10: "[50; 100)",
    o3: "[100; 140)",
    co: "[9400; 12400)",
    so2: "[80; 250)",
    no2: "[70; 150)",
  },
  {
    name: "Poor",
    pm25: "[50; 75)",
    pm10: "[100; 200)",
    o3: "[140; 180)",
    co: "[12400; 15400)",
    so2: "[250; 350)",
    no2: "[150; 200)",
  },
  {
    name: "Very Poor",
    pm25: "≥75",
    pm10: "≥200",
    o3: "≥180",
    co: "≥15400",
    so2: "≥350",
    no2: "≥200",
  },
];

const POLLUTANT_LABELS: Record<string, string> = {
  co: "CO",
  no: "NO",
  no2: "NO₂",
  o3: "O₃",
  so2: "SO₂",
  pm2_5: "PM₂.₅",
  pm10: "PM₁₀",
  nh3: "NH₃",
};

export default function ClimateInfo() {
  const { t } = useLanguage();
  const [airQuality, setAirQuality] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<string>("Dhaka");
  const [coords, setCoords] = useState({ lat: 23.8041, lon: 90.4152 }); // Default: Dhaka

  // Predefined coordinates for major cities
  const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
    Dhaka: { lat: 23.8041, lon: 90.4152 },
    Delhi: { lat: 28.7041, lon: 77.1025 },
    Mumbai: { lat: 19.076, lon: 72.8777 },
    Beijing: { lat: 39.9042, lon: 116.4074 },
    London: { lat: 51.5074, lon: -0.1278 },
    "New York": { lat: 40.7128, lon: -74.006 },
  };

  useEffect(() => {
    const fetchAirQuality = async () => {
      setLoading(true);
      const { lat, lon } = coords;
      try {
        const res = await fetch(
          `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=c38e4af053ed9b798807dfb36fbabd08`
        );
        const data = await res.json();

        if (data?.list?.length > 0) {
          const pollutants = data.list[0].components;
          const aqi = data.list[0].main.aqi;

          setAirQuality({
            aqi,
            qualitativeName:
              AQI_LEVELS.find((l) => l.index === aqi)?.name || "Unknown",
            components: pollutants,
            updatedAt: new Date(data.list[0].dt * 1000).toLocaleString(),
          });
        } else {
          setAirQuality(null);
        }
      } catch (error) {
        console.error("Air quality API error:", error);
        setAirQuality(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAirQuality();
  }, [coords]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setLocation(city);
    setCoords(CITY_COORDS[city] || CITY_COORDS["Dhaka"]);
  };

  const getAqiBadge = (aqi: number) => {
    const level = AQI_LEVELS.find((l) => l.index === aqi);
    if (!level) return null;
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${level.color} ${level.text}`}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
        {level.name} (AQI {aqi})
      </div>
    );
  };

  const formatValue = (key: string, value: number) => {
    return `${Number(value).toFixed(key === "co" ? 0 : 1)} µg/m³`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <span className="border-l-4 border-orange-500 pl-2">
              {t("widget.airQuality")} ({location})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-200 rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!airQuality) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            No air quality data available for {location}.
          </p>
        </CardContent>
      </Card>
    );
  }

  const pollutants = Object.entries(airQuality.components)
    .map(([key, value]) => ({
      key,
      label: POLLUTANT_LABELS[key] || key.toUpperCase(),
      value: Number(value),
      formatted: formatValue(key, Number(value)),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-orange-600" />
            <CardTitle className="text-lg">
              <span className="border-l-4 border-orange-500 pl-2 font-bold">
                {t("widget.airQuality")} • {location}
              </span>
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-gray-600" />
            {getAqiBadge(airQuality.aqi)}
          </div>
        </div>
        <div className="mt-2 flex justify-between items-center">
          <select
            value={location}
            onChange={handleLocationChange}
            className="text-sm border rounded-md px-2 py-1 bg-white dark:bg-gray-800"
          >
            {Object.keys(CITY_COORDS).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Updated: {airQuality.updatedAt}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-4">
        {/* Pollutant Grid */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            Current Air Pollutants (µg/m³)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {pollutants.map(({ label, formatted, value, key }) => {
              const isHigh =
                (key === "pm2_5" && value > 50) ||
                (key === "pm10" && value > 100) ||
                (key === "o3" && value > 140) ||
                (key === "no2" && value > 150);

              return (
                <div
                  key={key}
                  className={`flex flex-col items-center p-3 rounded-lg border transition-all ${
                    isHigh
                      ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800"
                      : "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-border"
                  } hover:shadow-sm`}
                >
                  <span className="text-xs font-medium text-muted-foreground mb-1">
                    {label}
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      isHigh
                        ? "text-red-700 dark:text-red-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {formatted}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AQI Scale Reference Table */}
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
                  <th className="text-center py-1.5 font-medium">NO₂</th>
                </tr>
              </thead>
              <tbody>
                {AQI_LEVELS.map((level, idx) => (
                  <tr
                    key={level.index}
                    className={`border-b dark:border-gray-700 transition-colors ${
                      airQuality.aqi === level.index
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
                      {AQI_BREAKPOINTS[idx].pm25}
                    </td>
                    <td className="text-center text-muted-foreground">
                      {AQI_BREAKPOINTS[idx].pm10}
                    </td>
                    <td className="text-center text-muted-foreground">
                      {AQI_BREAKPOINTS[idx].o3}
                    </td>
                    <td className="text-center text-muted-foreground">
                      {AQI_BREAKPOINTS[idx].no2}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Data from OpenWeatherMap • Real-time air quality
        </p>
      </CardContent>
    </Card>
  );
}
