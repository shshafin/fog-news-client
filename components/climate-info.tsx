"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartTooltipItem,
} from "@/components/ui/chart";
import { useLanguage } from "../providers/language-provider";

export default function ClimateInfo() {
  const { language, t } = useLanguage();
  const [climateData, setClimateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<string>("Dhaka"); // Default location

  // Fetch weather data for the selected location
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${location}&days=7&aqi=no&alerts=no`
        );

        const data = await res.json();

        if (data && data.current && data.forecast) {
          const forecast = data.forecast.forecastday.map((day: any) => ({
            day: new Date(day.date).toLocaleDateString("en-US", {
              weekday: "short",
            }),
            condition: day.day.condition.text,
            iconUrl: day.day.condition.icon,
            temp: day.day.avgtemp_c,
          }));

          // Set climate data
          setClimateData({
            temperature: data.current.temp_c,
            condition: data.current.condition.text,
            iconUrl: data.current.condition.icon,
            humidity: data.current.humidity,
            windSpeed: data.current.wind_kph,
            precipitation: data.current.precip_mm,
            feelsLike: data.current.feelslike_c,
            high: data.forecast.forecastday[0].day.maxtemp_c,
            low: data.forecast.forecastday[0].day.mintemp_c,
            localTime: data.location.localtime,
            forecast,
          });
        } else {
          setClimateData(null);
        }
      } catch (error) {
        console.error("Weather API error:", error);
        setClimateData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  // Handle location change
  const handleLocationChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLocation(event.target.value);
  };

  if (loading) {
    return <div className="h-64 bg-muted animate-pulse rounded-lg"></div>;
  }

  if (!climateData) {
    return (
      <div className="text-center">
        <p>No weather data available. Please check the location.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <span className="border-l-4 border-red-600 pl-2">
            {t("widget.climate")}(Dhaka)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Location Selector */}
        <div className="mb-4">
          {/* <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Select Location
          </label>
          <select
            id="location"
            value={location}
            onChange={handleLocationChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value={"Bangladesh"}>Bangladesh</option>
            <option value={"Dhaka"}>Dhaka</option>
          </select> */}
      
        </div>

        {/* Current Climate Info */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Temperature</span>
            <span className="font-medium">{climateData.temperature}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Condition</span>
            <span className="font-medium">{climateData.condition}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Humidity</span>
            <span className="font-medium">{climateData.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Wind Speed</span>
            <span className="font-medium">{climateData.windSpeed} km/h</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Precipitation</span>
            <span className="font-medium">{climateData.precipitation} mm</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Feels Like</span>
            <span className="font-medium">{climateData.feelsLike}°C</span>
          </div>
        </div>

        {/* Climate Graph */}
        <div className="h-48">
          <ChartContainer>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={climateData.forecast}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  domain={["dataMin - 0.2", "dataMax + 0.2"]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent>
                      <ChartTooltipItem label="Day" value={(value) => value} />
                      <ChartTooltipItem
                        label="Temperature"
                        value={(value) => `${value}°C`}
                      />
                    </ChartTooltipContent>
                  }
                  children={undefined}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorTemp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Global temperature anomalies relative to 1951-1980 average
        </p>
      </CardContent>
    </Card>
  );
}
