"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "bn"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionary
const translations = {
  en: {
    "site.name": "The Fog News",
    "nav.home": "Home",
    "nav.news": "News",
    "nav.politics": "Politics",
    "nav.business": "Business",
    "nav.technology": "Technology",
    "nav.entertainment": "Entertainment",
    "nav.sports": "Sports",
    "nav.lifestyle": "Lifestyle",
    "nav.opinion": "Opinion",
    "nav.epaper": "E-Paper",
    "hero.latest": "Latest News",
    "section.featured": "Featured News",
    "section.latest": "Latest News",
    "section.multimedia": "Multimedia",
    "section.interactive": "Interactive",
    "section.epaper": "E-Paper",
    "widget.weather": "Weather",
    "widget.climate": "Climate Info",
    "widget.market": "Share Market",
    "poll.title": "Weekly Poll",
    "poll.vote": "Vote",
    "poll.results": "Results",
    "quiz.title": "Daily Quiz",
    "quiz.start": "Start Quiz",
    "newsletter.title": "Subscribe to our Newsletter",
    "newsletter.placeholder": "Your email address",
    "newsletter.button": "Subscribe",
    "footer.about": "About Us",
    "footer.contact": "Contact",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.copyright": "© 2025 The Fog News. All rights reserved.",
    "language.switch": "বাংলা",
  },
  bn: {
    "site.name": "দ্য চোখ ইনসাইট",
    "nav.home": "হোম",
    "nav.news": "সংবাদ",
    "nav.politics": "রাজনীতি",
    "nav.business": "ব্যবসা",
    "nav.technology": "প্রযুক্তি",
    "nav.entertainment": "বিনোদন",
    "nav.sports": "খেলাধুলা",
    "nav.lifestyle": "লাইফস্টাইল",
    "nav.opinion": "মতামত",
    "nav.epaper": "ই-পেপার",
    "hero.latest": "সর্বশেষ সংবাদ",
    "section.featured": "বিশেষ প্রতিবেদন",
    "section.latest": "সর্বশেষ সংবাদ",
    "section.multimedia": "মাল্টিমিডিয়া",
    "section.interactive": "ইন্টারেক্টিভ",
    "section.epaper": "ই-পেপার",
    "widget.weather": "আবহাওয়া",
    "widget.climate": "জলবায়ু তথ্য",
    "widget.market": "শেয়ার বাজার",
    "poll.title": "সাপ্তাহিক জরিপ",
    "poll.vote": "ভোট দিন",
    "poll.results": "ফলাফল",
    "quiz.title": "দৈনিক কুইজ",
    "quiz.start": "কুইজ শুরু করুন",
    "newsletter.title": "আমাদের নিউজলেটার সাবস্ক্রাইব করুন",
    "newsletter.placeholder": "আপনার ইমেইল ঠিকানা",
    "newsletter.button": "সাবস্ক্রাইব",
    "footer.about": "আমাদের সম্পর্কে",
    "footer.contact": "যোগাযোগ",
    "footer.privacy": "গোপনীয়তা নীতি",
    "footer.terms": "সেবার শর্তাবলী",
    "footer.copyright": "© ২০২৪ দ্য চোখ ইনসাইট। সর্বস্বত্ব সংরক্ষিত।",
    "language.switch": "English",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    // Load language preference from localStorage on client side
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "bn")) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
