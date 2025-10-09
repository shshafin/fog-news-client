"use client";

import { useParams } from "next/navigation";
import { useLanguage } from "@/providers/language-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CategoryContent } from "../category-content";

export default function CategoryPage() {
  const { slug } = useParams();
  const { language } = useLanguage();

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CategoryContent
        slug={slug as string}
        language={language}
      />
      <Footer />
    </main>
  );
}
