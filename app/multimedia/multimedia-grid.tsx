"use client";

import { memo } from "react";
import { IMultimedia } from "@/lib/content-models";
import { MultimediaCard } from "./multimedia-card";

interface MultimediaGridProps {
  videos: IMultimedia[];
  isFull?: boolean;
}

export const MultimediaGrid = memo(function MultimediaGrid({
  videos,
  isFull,
}: MultimediaGridProps) {
  // Different layouts for homepage vs full page
  const gridClass = isFull
    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <div className={gridClass}>
      {videos.map((video, index) => (
        <MultimediaCard
          key={video._id}
          video={video}
          priority={index < 3} // Prioritize first 3 videos for loading
          isFeatured={!isFull && index === 0} // First video is featured on homepage
        />
      ))}
    </div>
  );
});
