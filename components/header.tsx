"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../providers/language-provider";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { Menu, X, Search, Newspaper, User, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import SearchBar from "./search-bar";
import { useAuth } from "@/providers/authProvider";
import { Category } from "@/lib/content-models";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import { LanguageSwitcher } from "./google-translate/GoogleTranslateProvider";

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const { data: categoriesData, refetch: categoryRef } = useApi<Category[]>(
    ["categories"],
    "/categories"
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  // Mock featured news items (replace with real API data later)
  const featuredNews = [
    {
      id: 1,
      title:
        "July Foundation runs out of funds, employees face salary uncertainty",
      image:
        "https://media.prothomalo.com/prothomalo-bangla%2F2025-11-02%2F8dcil05o%2Fr5.jpg?w=110&auto=format%2Ccompress&fmt=avif", // Replace with actual image path
    },
    {
      id: 2,
      title: "3 people beaten to death on suspicion of theft in Gaibandha",
      image:
        "https://media.prothomalo.com/prothomalo-bangla%2F2025-11-02%2F7pbfkq34%2F%E0%A7%A7.jpg?w=110&auto=format%2Ccompress&fmt=avif",
    },
    {
      id: 3,
      title: "Metro rail system plagued by 45 flaws",
      image:
        "https://media.prothomalo.com/prothomalo-bangla%2F2025-10-31%2Fwi1we361%2F%E0%A6%A6%E0%A7%81%E2%80%99%E0%A6%A6%E0%A6%BF%E0%A6%A8-%E0%A6%AA%E0%A6%B0-%E0%A6%A6%E0%A7%8B%E0%A6%95%E0%A6%BE%E0%A6%A8%E0%A6%BF%E0%A6%B0-%E0%A6%95%E0%A6%BE%E0%A6%9B%E0%A7%87-%E0%A6%AB%E0%A6%BF%E0%A6%B0%E0%A6%B2%E0%A7%8B-%E0%A6%86%E0%A6%B2%E0%A7%8B%E0%A6%9A%E0%A6%BF%E0%A6%A4-%E0%A6%B8%E0%A7%87%E0%A6%87-%E0%A6%AC%E0%A6%95%E0%A6%9F%E0%A6%BF-.00025806.Still001.jpg?w=110&auto=format%2Ccompress&fmt=avif",
    },
  ];

  const navItems = [
    { key: "nav.home", href: "/" },
    { key: "nav.news", href: "/news" },
    ...categories.slice(0, 7).map((cat) => ({
      key: cat.name,
      href: `/category/${cat.slug}`,
    })),
    { key: "nav.epaper", href: "/epaper" },
    { key: "Multimedia", href: "/multimedia" },
    { key: "Weather", href: "/weather" },
    { key: "Jobs", href: "/jobs" },
  ];

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData, categoryRef]);

  // Utility: Truncate text with ellipsis
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-2">
      {/* Top Row: Logo + Featured News */}
      <div className="container grid grid-cols-8 h-16 items-center justify-between  bg-white px-4 py-6">
        <div className="col-span-2 flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/newslogo.png"
              alt="The Fog News Logo"
              width={1000}
              height={1000}
              className="h-12 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Featured News Cards */}
        <div className="col-span-6 flex items-center justify-center gap-4 md:gap-6 overflow-x-auto scrollbar-hide w-full">
          {featuredNews.map((item, index) => (
            <div key={index} className="flex-1 flex gap-2 items-center">
              <Image
                src={item.image}
                alt="news"
                width={1000}
                height={1000}
                className="w-32 h-20 object-cover rounded-[1px]"
              />
              <p className="text-sm font-semibold">{item.title}</p>
            </div>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>
      <hr className="mt-10" />

      {/* Bottom Row: Nav Menu + Tools */}
      <div className="container flex items-center justify-between px-4 py-2">
        {/* Navigation Menu */}
        <nav
          className={cn(
            "flex items-center gap-4 overflow-x-auto whitespace-nowrap pb-2",
            isMobile && !isMenuOpen && "hidden"
          )}
        >
          <ul className="flex items-center gap-4">
            {navItems.map((item) => (
              <li key={item.key} className="">
                <Link
                  href={item.href}
                  className="text-sm font-medium hover:text-red-600 transition-colors"
                >
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right Tools: Search, E-paper, Language, Login, Menu */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-black"
            asChild
          >
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <div className="pl-2 border-l border-gray-200">
            <LanguageSwitcher />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-600 hover:text-black"
            asChild
          >
            <Link href="/epaper">
              <Newspaper className="h-5 w-5" />
            </Link>
          </Button>

          {/* <Button
            variant="ghost"
            size="icon"
            className={`text-gray-600 hover:text-black ${
              language === "en" ? "bg-red-50" : ""
            }`}
            onClick={toggleLanguage}
          >
            <Globe className="h-5 w-5" />
            <span className="ml-1 text-xs">
              {language === "en" ? "Eng" : "বাং"}
            </span>
          </Button> */}

          {/* {isAuthenticated ? (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-black"
              asChild
            >
              <Link href={`/${user?.role}/dashboard`}>
                <User className="h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-black"
              asChild
            >
              <Link href="/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )} */}

          {/* Hamburger Menu (Mobile) */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Search Bar (Below Nav on Mobile) */}
      {isMobile && isMenuOpen && (
        <div className="container px-4 pb-3">
          <SearchBar className="w-full" />
        </div>
      )}
    </header>
  );
}
