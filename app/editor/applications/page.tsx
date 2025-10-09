"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApi, useDelete } from "@/hooks/useApi";
import toast from "react-hot-toast";
import Link from "next/link";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function JobsApplicationsTable() {
  const [jobs, setJobs] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage,setItemsPerPage]=useState(10)
  const { data, isLoading, refetch } = useApi<any[]>(
    ["job-applications"],
    "/job-applications"
  );
  const { mutate: deleteSingleQuiz } = useDelete(
    (id) => `/job-applications/${id}`,
    ["job-applications"]
  );




 

  // Pagination
  const totalPages = Math.ceil(jobs.length / itemsPerPage);
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  useEffect(() => {
    if (data) {
      setJobs(data);
      console.log(data);
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSingleQuiz(id);
      toast.success("Job deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Error deleting quiz");
    }
  };

  return (
      <Suspense fallback={<LoadingSpinner />}><div className="space-y-6">
      <div className="flex items-center justify-start">
        <h1 className="text-3xl font-bold">Applications</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>

            <TableHead>Applied Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>View Job</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedJobs.map((job) => (
            <TableRow key={job._id}>
              <TableCell>{job.applicantName}</TableCell>
              <TableCell>{job.applicantEmail}</TableCell>
              <TableCell>{job.phone}</TableCell>
              <TableCell>{job.appliedDate.slice(0, 10)}</TableCell>
              <TableCell>{job.status}</TableCell>
              <TableCell>
                <Link href={`/admin/applications/${job._id}`}>View</Link>
              </TableCell>

              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => job._id && handleDelete(job._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
          {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={
                        currentPage === 1
                          ? undefined
                          : () =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      aria-disabled={currentPage === 1}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber: number;

                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={pageNumber === currentPage}
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  {totalPages > 5 && currentPage < totalPages - 2 && (
                    <>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setCurrentPage(totalPages)}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      aria-disabled={currentPage === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
      </Table>
    </div></Suspense>
    
  );
}
