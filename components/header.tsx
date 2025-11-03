"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../providers/language-provider";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, Newspaper, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import SearchBar from "./search-bar";
import { useAuth } from "@/providers/authProvider";
import { Category } from "@/lib/content-models";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";
import { LanguageSwitcher } from "./google-translate/GoogleTranslateProvider";

interface NewsItem {
  _id: string;
  title: string;
  subTitle: string;
  media?: string[];
  category?: {
    slug: string;
  };
  publishDate: string;
  isTrending?: boolean;
  feature?: boolean;
}

export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const { data: categoriesData, refetch: categoryRef } = useApi<Category[]>(
    ["categories"],
    "/categories"
  );

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 100); // Adjust threshold as needed
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch news data
  const { data: newsData, isLoading: newsLoading } = useApi<NewsItem[]>(
    ["news", "latest"],
    "/news"
  );

  // Extract up to 3 featured news items
  const featuredNews = React.useMemo(() => {
    if (!newsData) return [];
    return newsData
      .filter((item) => item.feature === true)
      .slice(0, 3)
      .map((item) => ({
        id: item._id,
        title: item.title,
        image:
          item.media && item.media.length > 0
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${item.media[0]}`
            : "/placeholder-image.jpg",
      }));
  }, [newsData]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

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

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-white transition-all duration-300",
        isScrolled ? "mt-0" : "mt-2"
      )}
    >
      {/* Top Row: Logo + Featured News - Hidden on scroll */}
      <div
        className={cn(
          "container grid grid-cols-8 items-center justify-between bg-white px-4 transition-all duration-300 overflow-hidden",
          isScrolled ? "h-0 py-0 opacity-0" : "h-16 py-6 opacity-100"
        )}
      >
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
        <div className="col-span-6 hidden xl:flex items-center justify-center gap-4 md:gap-6 overflow-x-auto scrollbar-hide w-full">
          {newsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-1 flex gap-2 items-center">
                <div className="w-32 h-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            ))
          ) : featuredNews?.length > 0 ? (
            featuredNews?.map((item) => (
              <div
                key={item.id}
                className="flex-1 flex gap-2 items-center min-w-[280px]"
              >
                <Image
                  src={item?.image}
                  alt={item.title.slice(0, 20)}
                  width={128}
                  height={80}
                  className="w-32 h-20 object-cover rounded-[1px]"
                  unoptimized
                />
                <p className="text-sm font-semibold line-clamp-2">
                  {item.title}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No featured news available</p>
          )}
        </div>
      </div>

      {/* Only show HR when top section is visible */}
      {!isScrolled && <hr className="mt-10" />}

      {/* Bottom Row: Nav Menu + Tools - Always visible */}
      <div
        className={cn(
          "container flex items-center justify-between px-4 transition-all duration-300",
          isScrolled ? "py-3" : "py-2"
        )}
      >
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
        <div className="flex items-center divide-x divide-gray-300 dark:divide-gray-700">
          {/* Search Section */}
          <div className="flex items-center gap-1 px-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
              asChild
            >
              <Link href="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
            <span className="text-sm hidden sm:inline">Search</span>
          </div>

          {/* Language Section */}
          <div className="px-3">
            <LanguageSwitcher />
          </div>

          <div className="w-[1px] bg-black"></div>

          {/* E-Paper Section */}
          <div className="flex items-center gap-1.5 px-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
              asChild
            >
              <Link href="/epaper" className="flex items-center gap-1.5">
                <Newspaper className="h-5 w-5" />
                <span className="text-sm hidden sm:inline">E-Paper</span>
              </Link>
            </Button>
          </div>

          {/* Mobile Menu (only on mobile) */}
          {isMobile && (
            <div className="px-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
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
