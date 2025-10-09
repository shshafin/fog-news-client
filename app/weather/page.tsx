"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
import WeatherWidget from "@/components/weather-widget";
import { usePathname } from "next/navigation";
import React from "react";

function WeatherPage() {
  const pathname = usePathname();

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <WeatherWidget currentPath={pathname} />
      </div>
      <Footer />
    </main>
  );
}

export default WeatherPage;
