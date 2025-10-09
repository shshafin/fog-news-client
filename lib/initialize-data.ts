import type { WeatherSettings, ClimateSettings, MarketSettings, CommentSettings, SiteSettings } from "./content-models"
import { initializeAuth } from "./auth"
import { articleService, pollService, quizService, mediaService, newsletterService } from "./data-service"

// Initialize data in localStorage if it doesn't exist
export function initializeData() {
  if (typeof window === "undefined") {
    return
  }

  // Initialize authentication
  initializeAuth()

  // Initialize mock data for services
  articleService.initialize()
  pollService.initialize()
  quizService.initialize()
  mediaService.initialize()
  newsletterService.initialize()



  const dataKeys = [
    "chokh_articles",
    "chokh_categories",
    "chokh_tags",
    "chokh_authors",
    "chokh_media",
    "chokh_polls",
    "chokh_quizzes",
    "chokh_epapers",
    "chokh_weather_settings",
    "chokh_climate_settings",
    "chokh_market_settings",
    "chokh_newsletter_subscribers",
    "chokh_comment_settings",
    "chokh_ads",
    "chokh_menu_items",
    "chokh_site_settings",
  ]

  // Initialize empty arrays for collection data
  dataKeys.forEach((key) => {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify([]))
    }
  })

  // Initialize default settings objects
  if (!localStorage.getItem("chokh_weather_settings")) {
    const defaultWeatherSettings: WeatherSettings = {
      apiKey: "",
      locations: ["dhaka", "london", "newyork"],
      refreshInterval: 30,
    }
    localStorage.setItem("chokh_weather_settings", JSON.stringify(defaultWeatherSettings))
  }

  if (!localStorage.getItem("chokh_climate_settings")) {
    const defaultClimateSettings: ClimateSettings = {
      co2: 418,
      tempRise: 1.1,
      seaLevel: 3.4,
      arcticIce: -13.1,
      tempData: [
        { year: 1980, temp: 0.08 },
        { year: 1990, temp: 0.25 },
        { year: 2000, temp: 0.39 },
        { year: 2010, temp: 0.62 },
        { year: 2020, temp: 0.98 },
        { year: 2023, temp: 1.1 },
      ],
    }
    localStorage.setItem("chokh_climate_settings", JSON.stringify(defaultClimateSettings))
  }

  if (!localStorage.getItem("chokh_market_settings")) {
    const defaultMarketSettings: MarketSettings = {
      markets: [
        { id: "dse", name: "Dhaka Stock Exchange", refreshInterval: 15 },
        { id: "nyse", name: "New York Stock Exchange", refreshInterval: 15 },
      ],
      stocks: [
        { symbol: "BEXIMCO", name: "Beximco Pharmaceuticals", market: "dse" },
        { symbol: "SQURPHARMA", name: "Square Pharmaceuticals", market: "dse" },
        { symbol: "AAPL", name: "Apple Inc.", market: "nyse" },
        { symbol: "MSFT", name: "Microsoft Corporation", market: "nyse" },
      ],
    }
    localStorage.setItem("chokh_market_settings", JSON.stringify(defaultMarketSettings))
  }

  if (!localStorage.getItem("chokh_comment_settings")) {
    const defaultCommentSettings: CommentSettings = {
      system: "native",
      moderationEnabled: true,
    }
    localStorage.setItem("chokh_comment_settings", JSON.stringify(defaultCommentSettings))
  }

  if (!localStorage.getItem("chokh_site_settings")) {
    const defaultSiteSettings: SiteSettings = {
      id: "1",
      siteName: {
        en: "The Fog News",
        bn: "দ্য চোখ ইনসাইট",
      },
      siteDescription: {
        en: "Get the latest news, updates, and insights from around the world in both English and Bangla.",
        bn: "ইংরেজি এবং বাংলা উভয় ভাষায় বিশ্বের সর্বশেষ খবর, আপডেট এবং অন্তর্দৃষ্টি পান।",
      },
      logo: "/placeholder.svg?height=60&width=200",
      favicon: "/favicon.ico",
      socialLinks: {
        facebook: "https://facebook.com/thechokh",
        twitter: "https://twitter.com/thechokh",
        instagram: "https://instagram.com/thechokh",
        youtube: "https://youtube.com/thechokh",
      },
      defaultLanguage: "en",
      contactEmail: "info@thechokh.com",
      seoSettings: {
        defaultTitle: "The Fog News - Latest News",
        defaultDescription: "Stay updated with the latest news and insights from The Fog News.",
        defaultKeywords: "news, bangladesh, world, insight",
        googleAnalyticsId: ""
      },
      themeSettings: {
        primaryColor: "#0057B8",
        secondaryColor: "#FFD700",
        fontFamily: "Inter, sans-serif",
      },
      commentSettings: {
        enabled: true,
        requireApproval: false,
        allowGuests: true
      }
    }
    localStorage.setItem("chokh_site_settings", JSON.stringify(defaultSiteSettings))
  }
}
