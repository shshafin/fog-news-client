"use client";

import { FileText } from "lucide-react";

interface EmptyStateProps {
  language: string;
}

export function EmptyState({ language }: EmptyStateProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <div className="mx-auto w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
          <FileText className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-2xl font-semibold mb-3">
          {language === "en" ? "No articles found" : "কোন নিবন্ধ পাওয়া যায়নি"}
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {language === "en"
            ? "There are currently no articles in this category. Check back later for updates."
            : "এই বিভাগে বর্তমানে কোন নিবন্ধ নেই। আপডেটের জন্য পরে আবার দেখুন।"}
        </p>
      </div>
    </div>
  );
}
