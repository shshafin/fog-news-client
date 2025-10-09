"use client";

import { useLanguage } from "../providers/language-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { IEpaper } from "@/lib/content-models";
import { getImageUrl } from "@/hooks/useGetImage";
import { saveAs } from "file-saver"; // Import file-saver
import toast from "react-hot-toast";
import { TableCell, TableRow } from "./ui/table";

export default function EPaperSection({ front }: { front: boolean }) {
  const { language, t } = useLanguage();
  const { data, isLoading, refetch } = useApi<IEpaper[]>(["epaper"], `/epaper`);
  const [epapers, setEpapers] = useState<IEpaper[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // Pagination state (client-side)
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(3);
  const pages = Math.max(1, Math.ceil(epapers?.length / rowsPerPage));

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
      if (data) {
        if (front) {
          setEpapers(data.slice(0, 3));
        } else {
          setEpapers(data);
        }
      }
    };
    fetchData();
  }, [data]);

  // Function to handle PDF download using file-saver
  const handleDownload = (epaper: IEpaper) => {
    const fullPath = getImageUrl(epaper.file); // Resolves the full file path

    // Log to verify the file URL

    // Check if the URL is valid
    if (!fullPath) {
      toast.error("Invalid PDF URL.");
      return;
    }

    // Use file-saver to download the PDF
    saveAs(fullPath, `${epaper.title}.pdf`); // Download the PDF using the title as filename
  };
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return epapers?.slice(start, end);
  }, [epapers, page, rowsPerPage]);

  // If filtered changes and current page is out of range, reset to 1
  useEffect(() => {
    if (page > pages && pages > 0) {
      setPage(1);
    }
  }, [page, pages]);

  // Reset to first page when rows per page changes
  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);
  return (
    <section className="mt-12 mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="border-l-4 border-red-600 pl-2">
          {t("section.epaper")}
        </span>
      </h2>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Latest editions</span>
          </div>
          {!front && (
            <div className="flex mb-5 items-center justify-end gap-3">
              <label
                htmlFor="rows"
                className="text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                Rows per page:
              </label>
              <select
                id="rows"
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[3, 5, 10, 20, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <table className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Loading Epaper...
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No Epaper found.{" "}
              </TableCell>
            </TableRow>
          ) : (
            items.map((epaper) => (
              <Card key={epaper._id} className="overflow-hidden">
                <div className="relative h-80 group">
                  <Image
                    src={getImageUrl(epaper.thumbnail) || "/placeholder.svg"}
                    alt={epaper.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                    <Link href={`/epaper/${epaper._id}`}>
                      <Button className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Read Now
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => handleDownload(epaper)} // Handle download click
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold">{epaper.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {epaper.date.toString().slice(0, 10)}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </table>
        {/* Pagination controls */}
        {pages > 1 && !front && (
          <div className="flex justify-center items-center mt-4 gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className={`py-2 px-2 border rounded-lg text-sm font-medium shadow-sm ${
                  page === 1
                    ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
                let pageNumber;
                if (pages <= 5) {
                  pageNumber = i + 1;
                } else if (page <= 3) {
                  pageNumber = i + 1;
                } else if (page >= pages - 2) {
                  pageNumber = pages - 4 + i;
                } else {
                  pageNumber = page - 2 + i;
                }

                // Ensure pageNumber is within valid range
                pageNumber = Math.max(1, Math.min(pages, pageNumber));

                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNumber)}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg text-sm font-medium shadow-sm ${
                      page === pageNumber
                        ? "bg-gradient-to-r from-purple-600 to-purple-400 text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              {pages > 5 && page < pages - 2 && (
                <span className="mx-1 text-gray-500 dark:text-gray-400">
                  ...
                </span>
              )}

              <button
                onClick={() => setPage(Math.min(pages, page + 1))}
                disabled={page === pages}
                className={`py-2 px-2 border rounded-lg text-sm font-medium shadow-sm ${
                  page === pages
                    ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {Math.min((page - 1) * rowsPerPage + 1, epapers.length)}{" "}
              to {Math.min(page * rowsPerPage, epapers.length)} of{" "}
              {epapers.length} entries
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
