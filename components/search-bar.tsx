"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../providers/language-provider";

export default function SearchBar({ className }: { className?: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { language } = useLanguage();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/search?q=${encodeURIComponent(searchQuery)}&lang=${language}`
      );
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`relative flex w-full max-w-sm items-center ${className}`}
    >
      <Input
        type="text"
        placeholder={
          language === "en" ? "Search articles..." : "নিবন্ধ অনুসন্ধান করুন..."
        }
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-10"
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-0"
      >
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}
