"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useLanguage } from "../providers/language-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Wind,
  Eye,
  Droplets,
  Thermometer,
  MapPin,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface WeatherForecast {
  day: string;
  condition: string;
  iconUrl: string;
  temp: number;
  humidity: number;
  windSpeed: number;
}

interface WeatherData {
  temperature: number;
  condition: string;
  iconUrl: string;
  high: number;
  low: number;
  localTime: string;
  forecast: WeatherForecast[];
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
}

const cities = [
  { name: "Dhaka", query: "Dhaka", gradient: "from-blue-500 to-purple-600" },
  {
    name: "Chittagong",
    query: "Chittagong",
    gradient: "from-green-500 to-blue-500",
  },
  { name: "Khulna", query: "Khulna", gradient: "from-orange-500 to-red-500" },
  {
    name: "Rajshahi",
    query: "Rajshahi",
    gradient: "from-yellow-500 to-orange-500",
  },
  { name: "Barisal", query: "Barisal", gradient: "from-teal-500 to-green-500" },
  {
    name: "Sylhet",
    query: "Sylhet",
    gradient: "from-indigo-500 to-purple-500",
  },
  { name: "Rangpur", query: "Rangpur", gradient: "from-pink-500 to-rose-500" },
  {
    name: "Mymensingh",
    query: "Mymensingh",
    gradient: "from-cyan-500 to-blue-500",
  },
];

// Cache system
const weatherCache = new Map<
  string,
  { data: WeatherData; timestamp: number }
>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface WeatherWidgetProps {
  currentPath?: string;
}

const WeatherSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="text-center space-y-2">
              <Skeleton className="h-4 w-8 mx-auto" />
              <Skeleton className="h-8 w-8 mx-auto rounded-full" />
              <Skeleton className="h-4 w-8 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <Card className="border-destructive/20">
    <CardContent className="pt-6">
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div>
          <h3 className="font-semibold text-lg">Weather data unavailable</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Unable to fetch weather information. Please try again.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onRetry}
          className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    </CardContent>
  </Card>
);

const getWeatherIcon = (condition: string) => {
  const lower = condition.toLowerCase();
  if (lower.includes("rain") || lower.includes("drizzle")) return CloudRain;
  if (lower.includes("snow")) return CloudSnow;
  if (lower.includes("cloud") || lower.includes("overcast")) return Cloud;
  if (lower.includes("sun") || lower.includes("clear")) return Sun;
  return Cloud;
};

export default function WeatherWidget({ currentPath }: WeatherWidgetProps) {
  const { t } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isFull, setIsFull] = useState(false);
  const [location, setLocation] = useState("Dhaka");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  console.log(weather);

  const currentCity = useMemo(
    () => cities.find((city) => city.query === location) || cities[0],
    [location]
  );

  const fetchWeather = useCallback(async (cityQuery: string, force = false) => {
    const cacheKey = cityQuery;
    const cached = weatherCache.get(cacheKey);

    if (!force && cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setWeather(cached.data);
      setLoading(false);
      setError(false);
      return;
    }

    if (!force) setLoading(true);
    if (force) setRefreshing(true);
    setError(false);

    try {
      const res = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${cityQuery}&days=7&aqi=no&alerts=no`
      );

      if (!res.ok) throw new Error("Weather API failed");

      const data = await res.json();

      const forecast: WeatherForecast[] = data.forecast.forecastday.map(
        (day: any) => ({
          day: new Date(day.date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          condition: day.day.condition.text,
          iconUrl: day.day.condition.icon,
          temp: Math.round(day.day.avgtemp_c),
          humidity: day.day.avghumidity,
          windSpeed: day.day.maxwind_kph,
        })
      );

      const weatherData: WeatherData = {
        temperature: Math.round(data.current.temp_c),
        condition: data.current.condition.text,
        iconUrl: data.current.condition.icon,
        high: Math.round(data.forecast.forecastday[0].day.maxtemp_c),
        low: Math.round(data.forecast.forecastday[0].day.mintemp_c),
        localTime: data.location.localtime,
        forecast,
        humidity: data.current.humidity,
        windSpeed: Math.round(data.current.wind_kph),
        visibility: Math.round(data.current.vis_km),
        feelsLike: Math.round(data.current.feelslike_c),
      };

      // Cache the data
      weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() });
      setWeather(weatherData);
      setError(false);
    } catch (error) {
      console.error("Weather API error:", error);
      setError(true);
      setWeather(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleLocationChange = useCallback(
    (newLocation: string) => {
      if (newLocation !== location) {
        setLocation(newLocation);
      }
    },
    [location]
  );

  const handleRetry = useCallback(() => {
    fetchWeather(location, true);
  }, [location, fetchWeather]);

  useEffect(() => {
    fetchWeather(location);
  }, [location, fetchWeather]);

  useEffect(() => {
    setIsFull(currentPath?.includes("/weather") || false);
  }, [currentPath]);

  // Preload other cities' weather data in background
  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      cities.forEach((city) => {
        if (city.query !== location) {
          fetchWeather(city.query);
        }
      });
    }, 2000);

    return () => clearTimeout(preloadTimer);
  }, [location, fetchWeather]);

  if (loading) {
    return <WeatherSkeleton />;
  }

  if (error) {
    return <ErrorState onRetry={handleRetry} />;
  }

  if (!weather) {
    return <ErrorState onRetry={handleRetry} />;
  }

  const WeatherIcon = getWeatherIcon(weather.condition);

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-1 h-6 bg-gradient-to-b ${currentCity.gradient} rounded-full`}
            />
            <span className="font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              {t("widget.weather")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {refreshing && (
              <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {!isFull && (
              <Button
                asChild
                size="sm"
                className={`bg-gradient-to-r ${currentCity.gradient} hover:opacity-90 text-white border-0 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                <Link
                  href="/weather"
                  className="flex items-center gap-1">
                  <span>View All</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs
          value={location}
          onValueChange={handleLocationChange}>
          <TabsList className="w-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-1 h-auto">
            {(isFull ? cities : cities.slice(0, 3)).map((city) => (
              <TabsTrigger
                key={city.query}
                value={city.query}
                className="flex-1 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm rounded-md py-2 px-3 text-sm font-medium transition-all duration-200">
                {city.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Current Weather Display */}
          <div className="bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm rounded-xl p-6 mt-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {currentCity.name}
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-white/60 dark:bg-slate-600/60">
                Now
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {weather.temperature}
                  </span>
                  <span className="text-xl text-muted-foreground">°C</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {weather.condition}
                </p>
                <p className="text-sm text-muted-foreground">
                  Feels like {weather.feelsLike}°C
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3" />
                    H: {weather.high}° L: {weather.low}°
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${currentCity.gradient} rounded-full blur-lg opacity-30`}
                  />
                  <WeatherIcon className="relative h-16 w-16 text-slate-700 dark:text-slate-200" />
                </div>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/20 dark:border-slate-600/20">
              <div className="text-center space-y-1">
                <Wind className="h-4 w-4 mx-auto text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="text-sm font-semibold">
                  {weather.windSpeed} km/h
                </p>
              </div>
              <div className="text-center space-y-1">
                <Droplets className="h-4 w-4 mx-auto text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="text-sm font-semibold">{weather.humidity}%</p>
              </div>
              <div className="text-center space-y-1">
                <Eye className="h-4 w-4 mx-auto text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Visibility</p>
                <p className="text-sm font-semibold">{weather.visibility} km</p>
              </div>
            </div>
          </div>

          {/* Forecast */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span>Forecast</span>
            </h3>
            <div className="bg-white/40 dark:bg-slate-700/40 backdrop-blur-sm rounded-xl p-4">
              <div
                className={`grid ${
                  isFull ? "grid-cols-4 lg:grid-cols-7" : "grid-cols-3"
                } gap-3`}>
                {(isFull ? weather.forecast : weather.forecast.slice(0, 3)).map(
                  (day, index) => (
                    <div
                      key={index}
                      className="text-center space-y-2 p-3 rounded-lg hover:bg-white/50 dark:hover:bg-slate-600/50 transition-colors duration-200">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                        {index === 0 ? "Today" : day.day}
                      </p>
                      <div className="relative mx-auto w-10 h-10">
                        <img
                          src={day.iconUrl}
                          alt={day.condition}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {day.temp}°
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center pt-2">
            Current time:{" "}
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
