"use client";

import { memo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Play, Clock, Eye, Volume2 } from "lucide-react";
import { IMultimedia } from "@/lib/content-models";
import { getImageUrl } from "@/hooks/useGetImage";
import { VideoPlayer } from "@/components/video-player";

interface MultimediaCardProps {
  video: IMultimedia;
  priority?: boolean;
  isFeatured?: boolean;
}

export const MultimediaCard = memo(function MultimediaCard({
  video,
  priority = false,
  isFeatured = false,
}: MultimediaCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  return (
    <Card
      className={`overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-0 bg-card ${
        isFeatured ? "lg:col-span-2 lg:row-span-2" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <CardContent className="p-0">
        {/* Video always visible */}
        <div className="relative">
          <VideoPlayer
            video={video}
            isPlaying={isPlaying}
          />
          {isPlaying && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setIsPlaying(false)}>
              ✕
            </Button>
          )}
        </div>

        {/* Title always visible */}
        <div className="p-4 space-y-3">
          <h3
            className={`font-bold text-foreground line-clamp-2 group-hover:text-red-600 transition-colors ${
              isFeatured ? "text-xl" : "text-base"
            }`}>
            {video.title}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
});
