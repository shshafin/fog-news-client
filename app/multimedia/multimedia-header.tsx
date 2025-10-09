"use client";

import Link from "next/link";
import { ChevronRight, Radio } from "lucide-react";

interface MultimediaHeaderProps {
  title: string;
  isLive?: boolean;
  isFull?: boolean;
}

export function MultimediaHeader({
  title,
  isLive,
  isFull,
}: MultimediaHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 md:gap-0">
      {/* Title Section */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="w-1 h-12 md:h-14 bg-gradient-to-b from-red-600 to-red-500 rounded-full"></div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            {title}
            {isLive && (
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-full animate-pulse">
                <Radio className="w-3 h-3" />
                LIVE
              </div>
            )}
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Latest multimedia content and video updates
          </p>
        </div>
      </div>

      {/* View All Videos Button */}
      {!isFull && (
        <Link
          href="/multimedia"
          className="group flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
          View All Videos
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </Link>
      )}
    </div>
  );
}
