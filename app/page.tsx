import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import NewsGrid from "@/components/news-grid";
import InteractiveSection from "@/components/interactive-section";
import WeatherWidget from "@/components/weather-widget";
import ClimateInfo from "@/components/climate-info";
import ShareMarket from "@/components/share-market";
import EPaperSection from "@/components/e-paper-section";
import Footer from "@/components/footer";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/loading-spinner";
import SideBarAddPage from "@/components/sidebar-ads";
import BannerAddPage from "@/components/banner-ads";
import CategoryNews from "@/components/categories/category-news";
import PopupAd from "@/components/popup-ads";
import MultimediaSection from "./multimedia/multimedia-section";
import LatesNews from "@/components/latest-news";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <BannerAddPage />
        <PopupAd />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">

              <LatesNews/>
              </div>
              <div className="col-span-2">

              <NewsGrid category="featured" limit={4} />
              </div>
            </div>
            <MultimediaSection />
            {/* <NewsGrid category="latest" limit={6} /> */}
            <CategoryNews />
            <EPaperSection front={true} />
          </div>
          <div className="space-y-8">
            <Suspense fallback={<LoadingSpinner />}>
              <WeatherWidget />
            </Suspense>
            <Suspense fallback={<LoadingSpinner />}>
              <ShareMarket />
            </Suspense>
            <InteractiveSection />
            <Suspense fallback={<LoadingSpinner />}>
              <ClimateInfo />
            </Suspense>
            <Suspense fallback={<LoadingSpinner />}>
              <SideBarAddPage />
            </Suspense>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
