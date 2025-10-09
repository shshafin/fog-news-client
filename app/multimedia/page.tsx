"use client";
import Footer from "@/components/footer";
import Header from "@/components/header";
// import MultimediaSection from "@/components/multimedia-section";
import { usePathname } from "next/navigation";
import React from "react";
import MultimediaSection from "./multimedia-section";

function MultimediaPage() {
  const pathname = usePathname();
  return (
    <main>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* <MultimediaSection currentPath={pathname} /> */}
          <MultimediaSection currentPath={pathname} />
        </div>
      </div>
      <Footer />
    </main>
  );
}

export default MultimediaPage;
