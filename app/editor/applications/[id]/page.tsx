"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useApi, usePost, usePostWithFiles } from "@/hooks/useApi";
import { getImageUrl } from "@/hooks/useGetImage";
import { IJobPost } from "@/lib/content-models";
import { get } from "http";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

function SingleApplicationPage() {
  const { id } = useParams();

  const [jobDetails, setJobDetails] = useState<any | null>(null);
  //   const { mutate: createJobsApplications } = usePostWithFiles("/job-applications", [
  //     "job-applications",
  //   ]);
  const { data, isLoading, refetch } = useApi<any>(
    ["job-applications", id],
    `/job-applications/${id}`,
    !!id
  );

  // Handle the download

  // Function to download the PDF using fetch and Blob API
  const handleDownload = async () => {
    try {
      const response = await fetch(getImageUrl(jobDetails.resumePath)); // Fetch the resume PDF
      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      const blob = await response.blob(); // Convert the response to a Blob
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob); // Create an object URL for the Blob
      link.download = `${jobDetails?.applicantName}.pdf`; // The name for the downloaded file
      link.click(); // Trigger the download
    } catch (error) {
      toast.error("Error downloading the file.");
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchJobDetails = async () => {
        try {
          await refetch();
          if (data) {
            setJobDetails(data);
          }
        } catch (error) {
          toast.error("Error fetching job details.");
          console.error(error);
        }
      };
      fetchJobDetails();
    }
  }, [id, data, refetch]);

  if (isLoading || !jobDetails) {
    return <div>Loading...</div>;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}> <main className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            {jobDetails.applicantName}
          </h2>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              Date :{jobDetails.appliedDate.slice(0, 10)}
            </span>
          </div>

          <div className="flex justify-between text-gray-600 mt-4">
            <div className="text-sm">
              <strong>Email:</strong>
              {jobDetails.applicantEmail}
            </div>
            <div className="text-sm">
              <strong>Phone:</strong> {jobDetails.phone}
            </div>
            <div className="text-sm">
              <strong>Status:</strong> {jobDetails.status}
            </div>
            <div className="text-sm">
              <strong>Job Post View:</strong>{" "}
              <Link href={`/jobs/${jobDetails.jobPost._id}`}>View</Link>
            </div>
          </div>
        </div>
        <p className="mt-6 text-gray-700 whitespace-pre-line text-center">
          {jobDetails.coverLetter
            .split("\n")
            .map((line: string, index: number) => (
              <span key={index}>{line}</span>
            ))}
        </p>
        <div className="flex justify-center">
          {/* <Button onClick={handleDownload}>Download PDF</Button> */}
          {jobDetails.resumePath && (
            <Button onClick={handleDownload} className="mt-4">
              Download Resume
            </Button>
          )}
        </div>
      </div>
    </main></Suspense>
   
  );
}

export default SingleApplicationPage;
