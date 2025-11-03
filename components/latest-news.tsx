"use client";

import { useApi } from "@/hooks/useApi";
import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface NewsItem {
  _id: string;
  title: string;
  subTitle: string;
  media?: string[];
  category?: {
    slug: string;
  };
  publishDate: string;
}

const LatesNews = () => {
  const {
    data: news = [],
    isLoading,
    error,
  } = useApi<NewsItem[]>(["news"], "news/highlighted");
  console.log("=====>",news);

  // Sort by publishDate descending (newest first)
  const sortedNews = [...news].sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading news</div>;

  return (
    <div className="bg-white p-4 border-r">
      {/* Tabs Header */}
      <div className="flex border-b mb-4">
        <button className="px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600">
          Latest
        </button>
        <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Trending
        </button>
      </div>

      {/* Numbered List */}
      <div className="space-y-4">
        {sortedNews.slice(0, 5).map((item, index) => (
          <Link
            key={item._id}
            href={`/news/${item._id}`}
            className="block hover:bg-gray-50 p-3 rounded-md transition"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl font-bold text-gray-400 min-w-6">
                {index + 1}
              </span>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDistanceToNow(new Date(item.publishDate), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LatesNews;
