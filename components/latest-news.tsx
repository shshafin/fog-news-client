// components/latest-trending-news.tsx
"use client";

import { useApi } from "@/hooks/useApi";
import React, { useState } from "react";

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
}

interface NewsResponse {
  latest: NewsItem[];
  trending: NewsItem[];
}

const LatestTrendingNews = () => {
  const {
    data: newsData = { latest: [], trending: [] },
    isLoading,
    error,
  } = useApi<NewsResponse>(["news", "highlighted"], "news/highlighted"); 

  

  const [activeTab, setActiveTab] = useState<"latest" | "trending">("latest");

  const latestLimited = (newsData.latest || []).slice(0, 6);
  const trendingLimited = (newsData.trending || []).slice(0, 6);
  const currentNewsList =
    activeTab === "latest" ? latestLimited : trendingLimited;

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 ">
      <div className="border-b border-gray-300 mb-4">
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab("latest")}
            className={`py-2 px-4 font-medium text-sm transition-colors ${
              activeTab === "latest"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`py-2 px-4 font-medium text-sm transition-colors ${
              activeTab === "trending"
                ? "border-b-2 border-black text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Trending
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {currentNewsList.length === 0 ? (
          <p className="text-gray-500">No news available.</p>
        ) : (
          currentNewsList.map((item, index) => (
            <div
              key={item._id}
              className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-0"
            >
              <span className="font-bold text-xl text-gray-400 w-6 flex-shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {item.title}
                </h3>
                {item.subTitle && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {item.subTitle}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LatestTrendingNews;
