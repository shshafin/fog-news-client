"use client";

import { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useApi, useDelete } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useAuth } from "@/providers/authProvider";

export default function AdminArticlesPage() {
  const { user } = useAuth();
  const [epapers, setEpapers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteEpaperId, setDeleteEpaperId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { data, isLoading, refetch } = useApi<any[]>(
    ["advertisement"],
    `/advertisement`
  );
  const { mutate: deleteSingleEpaper } = useDelete(
    (id) => `/advertisement/${id}`,
    ["advertisement"]
  );

  const itemsPerPage = 10;

  // Filter articles based on search query and filters
  const filteredEpapers = epapers.filter((epaper) => {
    const matchesSearch =
      searchQuery === "" ||
      epaper.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEpapers.length / itemsPerPage);
  const paginatedEpapers = filteredEpapers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (id: string) => {
    setDeleteEpaperId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteEpaperId) return;

    try {
      await deleteSingleEpaper(deleteEpaperId);
      toast.success("Deleted The Epaper");
      await refetch();
    } catch (error) {
      toast.error("Error deleting article");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteEpaperId(null);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
      if (data) {
        setEpapers(data);
      }
    };
    fetchData();
  }, [data]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {" "}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Advertisement</h1>
          <Button asChild>
            <Link href={`/${user?.role}/ads/create`}>
              <Plus className="mr-2 h-4 w-4" /> Create Ads
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Advertisement Management</CardTitle>
            <CardDescription>
              Manage all Advertisements across the website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Advertisements..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Url</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Data</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading Advertisement...
                        </TableCell>
                      </TableRow>
                    ) : paginatedEpapers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No Advertisement found.{" "}
                          {searchQuery ? (
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
                      paginatedEpapers.map((epaper) => (
                        <TableRow key={epaper._id}>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {epaper.targetUrl}
                          </TableCell>

                          <TableCell>{epaper.type}</TableCell>
                          <TableCell>{epaper.startDate.slice(0, 10)}</TableCell>
                          <TableCell>{epaper.endDate.slice(0, 10)}</TableCell>
                          <TableCell>{epaper.status}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {/* <DropdownMenuItem asChild>
                                <Link
                                  href={`/epaper/${epaper._id}`}
                                  target="_blank"
                                >
                                  <Eye className="mr-2 h-4 w-4" /> View
                                </Link>
                              </DropdownMenuItem> */}
                                {/* <DropdownMenuItem asChild>
                                <Link href={`/admin/ads/${epaper._id}`}>
                                  <Pencil className="mr-2 h-4 w-4" /> Edit
                                </Link>
                              </DropdownMenuItem> */}
                                <DropdownMenuItem
                                  onClick={() =>
                                    epaper._id && handleDeleteClick(epaper._id)
                                  }
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

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
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        aria-disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </CardContent>
        </Card>

        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                article and remove it from the website.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Suspense>
  );
}
