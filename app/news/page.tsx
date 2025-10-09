"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useApi } from "@/hooks/useApi";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { getImageUrl } from "@/hooks/useGetImage";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Clock, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

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

// Skeleton component for loading state
const NewsCardSkeleton = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <CardContent className="p-4">
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-1" />
      <Skeleton className="h-4 w-1/2" />
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Skeleton className="h-4 w-24" />
    </CardFooter>
  </Card>
);

export default function NewsPage() {
  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);

  // API call - removed the problematic refetch logic
  const {
    data: news = [],
    isLoading,
    error,
  } = useApi<NewsItem[]>(["news"], "/news");

  // Memoize the pagination calculations
  const paginationData = useMemo(() => {
    const totalItems = news.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const items = news.slice(start, end);

    return {
      totalItems,
      totalPages,
      items,
      start: Math.min(start + 1, totalItems),
      end: Math.min(end, totalItems),
    };
  }, [news, page, rowsPerPage]);

  // Reset to first page when page is out of range
  useEffect(() => {
    if (page > paginationData.totalPages && paginationData.totalPages > 0) {
      setPage(1);
    }
  }, [page, paginationData.totalPages]);

  // Reset to first page when rows per page changes
  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  }, []);

  // Handle pagination
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(Math.max(1, Math.min(paginationData.totalPages, newPage)));
    },
    [paginationData.totalPages]
  );

  // Generate page numbers for pagination
  const pageNumbers = useMemo(() => {
    const { totalPages } = paginationData;
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (page >= totalPages - 2) {
      return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    }

    return Array.from({ length: 5 }, (_, i) => page - 2 + i);
  }, [page, paginationData.totalPages]);

  // Format date helper
  const formatDate = useCallback((dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString?.slice(0, 10) || "Unknown date";
    }
  }, []);

  if (error) {
    return (
      <main>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center min-h-[400px]">
              <Card className="w-full max-w-md">
                <CardContent className="p-8 text-center">
                  <div className="text-red-500 mb-4 text-4xl">⚠️</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Failed to load news
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    We're having trouble loading the latest news. Please try
                    refreshing the page or check your connection.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Refresh Page
                  </button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header with controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h1 className="text-3xl font-bold flex items-center">
              <span className="border-l-4 border-red-600 pl-3">All News</span>
            </h1>

            {!isLoading && paginationData.totalItems > 0 && (
              <div className="flex items-center gap-3">
                <label
                  htmlFor="rows"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Items per page:
                </label>
                <select
                  id="rows"
                  value={rowsPerPage}
                  onChange={(e) =>
                    handleRowsPerPageChange(Number(e.target.value))
                  }
                  className="h-10 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200">
                  {[20, 40, 60, 80, 100].map((n) => (
                    <option
                      key={n}
                      value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: rowsPerPage }).map((_, index) => (
                <NewsCardSkeleton key={index} />
              ))}
            </div>
          ) : paginationData.items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginationData.items.map((item) => (
                <Card
                  key={item._id}
                  className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={
                        item.media?.[0]
                          ? getImageUrl(item.media[0])
                          : "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg"
                      }
                      alt={item.title || "News"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {item.category?.slug && (
                      <Badge
                        className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white shadow-md"
                        variant="secondary">
                        {item.category.slug}
                      </Badge>
                    )}
                  </div>

                  <CardContent className="p-5">
                    <Link
                      href={`/news/${item._id}`}
                      className="block">
                      <h3 className="text-lg font-bold mb-3 hover:text-red-600 transition-colors line-clamp-2 leading-tight">
                        {item.title}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {item.subTitle}
                    </p>
                  </CardContent>

                  <CardFooter className="p-5 pt-0">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span>{formatDate(item.publishDate)}</span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="w-full">
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-6">
                  <svg
                    className="w-20 h-20 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  No news articles found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back later for the latest news and updates.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {paginationData.totalPages > 1 && !isLoading && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-12 gap-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {paginationData.start} to {paginationData.end} of{" "}
                {paginationData.totalItems} articles
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`p-2 rounded-lg border text-sm font-medium shadow-sm transition-all duration-200 ${
                    page === 1
                      ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-red-300"
                  }`}>
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {pageNumbers.map((pageNumber, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium shadow-sm transition-all duration-200 ${
                        page === pageNumber
                          ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-md"
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-red-300"
                      }`}>
                      {pageNumber}
                    </button>
                  ))}
                </div>

                {paginationData.totalPages > 5 &&
                  page < paginationData.totalPages - 2 && (
                    <span className="mx-2 text-gray-500 dark:text-gray-400">
                      ...
                    </span>
                  )}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === paginationData.totalPages}
                  className={`p-2 rounded-lg border text-sm font-medium shadow-sm transition-all duration-200 ${
                    page === paginationData.totalPages
                      ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-red-300"
                  }`}>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
