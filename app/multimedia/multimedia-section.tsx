"use client";

import { useLanguage } from "@/providers/language-provider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { IMultimedia } from "@/lib/content-models";
import { MultimediaHeader } from "./multimedia-header";
import { MultimediaGrid } from "./multimedia-grid";
import { MultimediaPagination } from "./multimedia-pagination";
import { MultimediaControls } from "./multimedia-controls";
import { MultimediaError } from "./multimedia-error";
import { MultimediaEmpty } from "./multimedia-empty";
import { MultimediaSkeleton } from "./multimedia-skeleton";

interface MultimediaProps {
  currentPath?: string;
}

export default function MultimediaSection({ currentPath }: MultimediaProps) {
  const { language, t } = useLanguage();
  const [isFull, setIsFull] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(6);

  // API call with optimized caching
  const {
    data: videos = [],
    isLoading,
    error,
  } = useApi<IMultimedia[]>(["video"], `/video`);

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalItems = videos.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const items = videos.slice(start, end);

    return {
      totalItems,
      totalPages,
      items,
      startIndex: Math.min(start + 1, totalItems),
      endIndex: Math.min(end, totalItems),
    };
  }, [videos, page, rowsPerPage]);

  // Check if we're on the full multimedia page
  useEffect(() => {
    setIsFull(currentPath?.includes("/multimedia") ?? false);
  }, [currentPath]);

  // Reset to first page when page is out of range
  useEffect(() => {
    if (page > paginationData.totalPages && paginationData.totalPages > 0) {
      setPage(1);
    }
  }, [page, paginationData.totalPages]);

  // Optimized handlers with useCallback
  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(Math.max(1, Math.min(paginationData.totalPages, newPage)));
      // Smooth scroll to top of section
      document.getElementById("multimedia-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [paginationData.totalPages]
  );

  // Get items to display based on context
  const displayItems = useMemo(() => {
    if (isFull) {
      return paginationData.items;
    }
    // For homepage, show latest 6 videos in 2 rows
    return videos.slice(0, 6);
  }, [isFull, paginationData.items, videos]);

  if (error) {
    return <MultimediaError />;
  }

  return (
    <section
      id="multimedia-section"
      className="py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header with live indicator */}
        <MultimediaHeader
          title={t("section.multimedia")}
          isLive={!isLoading && videos.length > 0}
          isFull={isFull}
        />

        {/* Controls */}
        {isFull && !isLoading && videos.length > 0 && (
          <MultimediaControls
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalItems={paginationData.totalItems}
            startIndex={paginationData.startIndex}
            endIndex={paginationData.endIndex}
            language={language}
          />
        )}

        {/* Content */}
        <div className="relative">
          {isLoading ? (
            <MultimediaSkeleton
              count={isFull ? rowsPerPage : 6}
              isFull={isFull}
            />
          ) : displayItems.length > 0 ? (
            <MultimediaGrid
              videos={displayItems}
              isFull={isFull}
            />
          ) : (
            <MultimediaEmpty language={language} />
          )}
        </div>

        {/* Pagination for full page */}
        {paginationData.totalPages > 1 && isFull && !isLoading && (
          <MultimediaPagination
            currentPage={page}
            totalPages={paginationData.totalPages}
            onPageChange={handlePageChange}
            totalItems={paginationData.totalItems}
            startIndex={paginationData.startIndex}
            endIndex={paginationData.endIndex}
            language={language}
          />
        )}
      </div>
    </section>
  );
}
