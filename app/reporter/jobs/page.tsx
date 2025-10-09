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
import { IJobPost } from "@/lib/content-models";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useAuth } from "@/providers/authProvider";

export default function JobsTable() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [jobs, setJobs] = useState<IJobPost[]>([]);
  const { data, isLoading, refetch } = useApi<IJobPost[]>(["jobs"], "/jobs");
  const { mutate: deleteSingleQuiz } = useDelete(
    (id) => `/jobs/${id}`,
    ["jobs"]
  );
  // Filter articles based on search query and filters
  const filteredArticles = jobs.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedJobs = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
  };
  useEffect(() => {
    if (data) {
      setJobs(data);
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
    <Suspense fallback={<LoadingSpinner />}>  <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <Button asChild>
          <Link href={`/${user?.role}/jobs/create`}>Create New Job</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Active</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                Loading Jobs...
              </TableCell>
            </TableRow>
          ) : paginatedJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No Jobs found.{" "}
                {searchQuery ||
                statusFilter !== "all" ||
                categoryFilter !== "all" ? (
                  <Button
                    variant="link"
                    onClick={resetFilters}
                    className="px-2 py-0 h-auto"
                  >
                    Reset filters
                  </Button>
                ) : null}
              </TableCell>
            </TableRow>
          ) : (
            paginatedJobs.map((job) => (
              <TableRow key={job._id}>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.description}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.contactEmail}</TableCell>
                <TableCell>{job.jobType}</TableCell>
                <TableCell>{job.salary}</TableCell>
                <TableCell>{job.isActive ? "True" : "False"}</TableCell>

                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => job._id && handleDelete(job._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

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
    </div></Suspense>
  
  );
}
