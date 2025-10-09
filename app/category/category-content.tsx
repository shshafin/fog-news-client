"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { IArticle } from "@/lib/content-models";
import UseAxiosPublic from "@/hooks/UseAxiosPublic";
import toast from "react-hot-toast";
import { ArticleGrid } from "./article-grid";
import { CategorySkeleton } from "./category-skeleton";
import { EmptyState } from "./empty-state";
import { CategoryHeader } from "./category-header";
import { Pagination } from "./pagination";

interface CategoryContentProps {
  slug: string;
  language: string;
}

export function CategoryContent({ slug, language }: CategoryContentProps) {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Memoize pagination calculations
  const { items, totalPages, startIndex, endIndex } = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = articles.slice(start, end);
    const pages = Math.max(1, Math.ceil(articles.length / rowsPerPage));

    return {
      items: paginatedItems,
      totalPages: pages,
      startIndex: Math.min(start + 1, articles.length),
      endIndex: Math.min(end, articles.length),
    };
  }, [articles, page, rowsPerPage]);

  // Memoized fetch function to prevent unnecessary re-creation
  //   const fetchArticles = useCallback(async () => {
  //     if (!slug) return;

  //     setIsLoading(true);
  //     try {
  //       const axiosInstance = UseAxiosPublic();
  //       const response = await axiosInstance.get(`/news/category/${slug}`);

  //       setArticles(response.data);

  //       // Extract title from first article
  //       if (response.data.length > 0) {
  //         setTitle(response.data[0].category?.name || "General");
  //       }
  //     } catch (error) {
  //       toast.error("Error fetching articles. Please try again later.");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   }, [slug]);

  const fetchArticles = useCallback(async () => {
    if (!slug) return;

    setIsLoading(true);
    try {
      const axiosInstance = UseAxiosPublic();
      const response = await axiosInstance.get(`/news/category/${slug}`);

      // sort by publishDate (newest first)
      const sorted = [...response.data].sort(
        (a: any, b: any) =>
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
      );

      setArticles(sorted);

      if (sorted.length > 0) {
        setTitle(sorted[0].category?.name || "General");
      }
    } catch (error) {
      toast.error("Error fetching articles. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Reset page when filters change
  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages]);

  // Reset page when rows per page changes
  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleRowsPerPageChange = useCallback((newRowsPerPage: number) => {
    setRowsPerPage(newRowsPerPage);
  }, []);

  if (isLoading) {
    return <CategorySkeleton />;
  }

  if (articles.length === 0) {
    return <EmptyState language={language} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CategoryHeader title={title} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <p className="text-sm text-muted-foreground">
          {language === "en"
            ? `Showing ${startIndex} to ${endIndex} of ${articles.length} articles`
            : `${articles.length} টি নিবন্ধের মধ্যে ${startIndex} থেকে ${endIndex} দেখানো হচ্ছে`}
        </p>

        <div className="flex items-center gap-2">
          <label
            htmlFor="rows"
            className="text-sm font-medium text-muted-foreground">
            {language === "en" ? "Show:" : "দেখান:"}
          </label>
          <select
            id="rows"
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
            className="h-9 px-3 rounded-lg border bg-background text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary">
            {[6, 9, 12, 18, 24].map((n) => (
              <option
                key={n}
                value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ArticleGrid articles={items} />

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={articles.length}
          startIndex={startIndex}
          endIndex={endIndex}
          language={language}
        />
      )}
    </div>
  );
}
