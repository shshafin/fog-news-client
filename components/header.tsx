"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "../providers/language-provider";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import SearchBar from "./search-bar";
import { useAuth } from "@/providers/authProvider";
import { Category } from "@/lib/content-models";
import { useApi } from "@/hooks/useApi";
import Image from "next/image";

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
  // { key: "nav.politics", href: "/politics" },
  // { key: "nav.business", href: "/business" },
  // { key: "nav.technology", href: "/technology" },
  // { key: "nav.entertainment", href: "/entertainment" },
  // { key: "nav.sports", href: "/sports" },
  // { key: "nav.lifestyle", href: "/lifestyle" },
  // { key: "nav.opinion", href: "/opinion" },

  const navItems = [
    { key: "nav.home", href: "/" },
    { key: "nav.news", href: "/news" },
    ...categories.slice(0, 7).map((cat) => ({
      key: cat.name, // Assuming `cat.name` is already a translated/displayable string
      href: `/category/${cat.slug}`, // Use slug or some unique field
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
  // console.log("Header rendered with language:", user,isAuthenticated);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="md:hidden">
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
          {/* <Link
            href="/"
            className="flex items-center space-x-2">
            <span className="text-xl font-bold text-red-600">
              {t("site.name")}
            </span>
          </Link> */}
          <Link
            href="/"
            className="flex items-center">
            <Image
              src="/newslogo.png"
              alt="The Fog News Logo"
              width={40}
              height={40}
              className="h-32 w-32 object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <button className="bg-red-500 py-2 px-3 rounded-lg text-white font-bold">
              <Link href={`/${user?.role}/dashboard`}>Dashboard</Link>
            </button>
          )}{" "}
          {/* <Button variant="outline" onClick={toggleLanguage}>
            {t("language.switch")}
          </Button> */}
          {/* <ModeToggle /> */}
        </div>
      </div>

      <div className="flex container justify-between items-center gap-4">
        <nav className={cn(" pb-3", isMobile && !isMenuOpen && "hidden")}>
          <ul className="flex flex-wrap gap-4">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className="text-sm font-medium hover:text-red-600 transition-colors">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          {isMobile && <SearchBar className="mt-3" />}
        </nav>
        {/* <div>
          {isAuthenticated && (
            <Link href={`/${user?.role}/dashboard`}>Go To Dashboard</Link>
          )}{" "}
        </div> */}
      </div>
    </header>
  );
}
