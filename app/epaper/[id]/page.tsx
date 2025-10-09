"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import { getImageUrl } from "@/hooks/useGetImage";
import { IEpaper } from "@/lib/content-models";
import { Download, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Document, Page, pdfjs } from "react-pdf";
import { saveAs } from "file-saver"; // Import file-saver
import SideBarAddPage from "@/components/sidebar-ads";
// Set the worker source for pdfjs-dist
// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
function SingleEpaperView() {
  const { id } = useParams();
  const [epaper, setEpaper] = useState<IEpaper>({} as IEpaper);
  const [epapers, setEpapers] = useState<IEpaper[]>([]);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1); // Starting page number
  const { data: epapersData, refetch: epaperFetch } = useApi<IEpaper[]>(
    ["epaper"],
    `/epaper`
  );
  const { data, isLoading, refetch } = useApi<IEpaper>(
    ["epaper", id],
    `/epaper/${id}`,
    !!id
  );

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

  useEffect(() => {
    const fetchEpaper = async () => {
      try {
        await refetch();
        if (data) {
          setEpaper(data);
        }
      } catch (error) {
        toast.error("Error fetching epaper data.");
        console.error(error);
      }
    };
    fetchEpaper();
  }, [id, data, refetch]);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages); // Set the number of pages of the PDF
  };
  useEffect(() => {
    const fetchData = async () => {
      await epaperFetch();
      if (epapersData) {
        setEpapers(epapersData);
      }
    };
    fetchData();
  }, [epapersData]);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="w-full flex mt-3 justify-between gap-4">
        {/* Display the title */}
        {/* <h1 className="text-3xl font-bold text-center">
          Viewing ePaper: {epaper.title}
        </h1> */}

        <div className="flex w-full mt-4 flex-col p-2 gap-3">
          {epapers.slice(0, 5).map((epaper) => (
            <Card key={epaper._id} className="overflow-hidden">
              <div className="relative w-full h-32 group">
                <Image
                  src={ getImageUrl(epaper.thumbnail)
                      || "/placeholder.svg"
                  }
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
          ))}
        </div>
        <div className="border rounded-t-lg w-full">
          {/* Navigation for multiple pages */}
          <div className="flex justify-between">
            <button
              onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
              disabled={pageNumber === 1}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Previous
            </button>
            <span>
              Page {pageNumber} of {numPages}
            </span>
            <button
              onClick={() =>
                setPageNumber((prev) => Math.min(prev + 1, numPages))
              }
              disabled={pageNumber === numPages}
              className="px-4 py-2 bg-gray-300 rounded-md"
            >
              Next
            </button>
          </div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div>
              {/* PDF Viewer */}
              {epaper.file && (
                <div>
                  <Document
                    file={getImageUrl(epaper.file)}
                    onLoadSuccess={onLoadSuccess}
                  >
                    <Page
                      pageNumber={pageNumber}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                </div>
              )}
            </div>
          )}
        </div>
        <SideBarAddPage />
      </div>
      <Footer />
    </main>
  );
}

export default SingleEpaperView;
