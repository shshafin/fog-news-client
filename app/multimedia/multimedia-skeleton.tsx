"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface MultimediaSkeletonProps {
  count: number;
  isFull?: boolean;
}

export function MultimediaSkeleton({ count, isFull }: MultimediaSkeletonProps) {
  return (
    <div
      className={`grid gap-6 ${
        isFull
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      }`}>
      {Array.from({ length: count }, (_, i) => (
        <Card
          key={i}
          className="overflow-hidden border-0 shadow-md">
          <CardContent className="p-0">
            <Skeleton className="aspect-video w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-12" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
