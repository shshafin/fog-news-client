"use client";

import { memo } from "react";
import { IArticle } from "@/lib/content-models";
import { ArticleCard } from "./article-card";

interface ArticleGridProps {
  articles: IArticle[];
}

export const ArticleGrid = memo(function ArticleGrid({
  articles,
}: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {articles.map((article) => (
        <ArticleCard
          key={article._id}
          article={article}
        />
      ))}
    </div>
  );
});
