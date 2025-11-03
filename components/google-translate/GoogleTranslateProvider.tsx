/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

// Use interface merging with the existing google maps types
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
  }
}

// Extend the existing google type without conflicting - make google required
interface ExtendedWindow extends Window {
  google: any; // Remove the ? to make it required
}

function GoogleTranslateProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const addGoogleTranslateScript = () => {
      if (!document.querySelector("#google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        document.body.appendChild(script);
      }

      window.googleTranslateElementInit = () => {
        const win = window as unknown as ExtendedWindow;
        if (win.google && !isInitialized) {
          new win.google.translate.TranslateElement(
            {
              pageLanguage: "x",
              includedLanguages: "en,fr,iu,es,de,ar,pt,hi,bn",
              layout:
                win.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
            },
            "google_translate_element"
          );
          setIsInitialized(true);
        }
      };
    };

    addGoogleTranslateScript();
  }, [isInitialized]);

  return (
    <>
      <div id="google_translate_element" className="hidden"></div>
      {children}
    </>
  );
}

export default GoogleTranslateProvider;

export function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState("es");

  useEffect(() => {
    const storedLang = localStorage.getItem("selectedLanguage");
    const lang = storedLang || "es";
    setSelectedLanguage(lang);

    if (lang === "es") {
      document.cookie =
        "googtrans=/es/es; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/";
    } else {
      document.cookie = `googtrans=/es/${lang}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
    }
  }, []);

  const handleChange = (newLang: string) => {
    if (!newLang) return;

    setSelectedLanguage(newLang);
    localStorage.setItem("selectedLanguage", newLang);

    if (newLang === "es") {
      document.cookie =
        "googtrans=/es/es; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/";
    } else {
      document.cookie = `googtrans=/es/${newLang}; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/`;
    }

    const select = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;
    if (select) {
      select.value = newLang;
      select.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select onValueChange={handleChange} value={selectedLanguage}>
        {/* 🔥 Remove focus ring here */}
        <SelectTrigger className="w-auto h-6 md:h-auto outline-none border-none font-normal text-black/70 bg-white focus:ring-0 focus:outline-none focus:border-none">
          <SelectValue>
            {{
              en: "English",
              fr: "French",
              iu: "Inuktut (Syllabics)",
              es: "Spanish",
              de: "German",
              ar: "Arabic",
              pt: "Portuguese",
              hi: "Hindi",
              bn: "Bangla",
            }[selectedLanguage] || "Select a language"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="bn">Bangla</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}