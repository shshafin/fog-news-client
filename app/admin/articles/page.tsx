"use client";

import { Suspense, useEffect, useState } from "react";
import type { Article, Category } from "@/lib/content-models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
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
import {
  Eye,
  Pencil,
  Trash2,
  MoreHorizontal,
  Plus,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useApi, useDelete, usePatchWithFiles } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useAuth } from "@/providers/authProvider";
import { Switch } from "@/components/ui/switch";

// Extend the interface to include `isTrending`
interface IArticle {
  _id: string;
  title: string;
  slug?: string;
  media?: string[];
  author?: string;
  category: string | Category;
  publishDate?: string;
  subTitle?: string;
  description?: string;
  language?: string;
  status?: string;
  isTrending?: boolean; // <-- Added
}

export default function AdminArticlesPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useApi<IArticle[]>(["news"], "/news");
  const { mutate: deleteSingleNews } = useDelete(
    (id) => `/news/${id}`,
    ["news"]
  );
  const { mutate: updateNews } = usePatchWithFiles(
    (id: string) => `/news/${id}`,
    ["news"]
  );

  const {
    data: categoriesData,
    isLoading: categoryLoad,
    refetch: categoryRef,
  } = useApi<Category[]>(["categories"], "/categories");

  // Filter articles
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.description &&
        article.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === "all" ||
      (typeof article.category === "object"
        ? (article.category as Category).name === categoryFilter
        : article.category === categoryFilter);

    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle delete
  const handleDeleteClick = (id: string) => {
    setDeleteArticleId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteArticleId) return;

    try {
      await deleteSingleNews(deleteArticleId);
      toast.success("Deleted The Article");
      await refetch();
    } catch (error) {
      toast.error("Error deleting article");
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteArticleId(null);
    }
  };

  // Handle trending toggle
  const handleToggleTrending = async (id: string, isTrending: boolean) => {
    try {
      await updateNews({ id, data: { isTrending } });
      toast.success(
        `Article ${isTrending ? "marked as trending" : "removed from trending"}`
      );
      await refetch();
    } catch (error) {
      toast.error("Failed to update trending status");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "default";
    }
  };

  // Fetch articles
  useEffect(() => {
    if (Array.isArray(data)) {
      setArticles(data);
    }
  }, [data]);

  // Fetch categories
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Articles</h1>
          <Button asChild>
            <Link href={`/${user?.role}/articles/create`}>
              <Plus className="mr-2 h-4 w-4" /> Create Article
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Article Management</CardTitle>
            <CardDescription>
              Manage all articles across the website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={resetFilters}
                    title="Reset filters"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-center">
                        Trending
                      </TableHead>{" "}
                      {/* NEW */}
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading articles...
                        </TableCell>
                      </TableRow>
                    ) : paginatedArticles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No articles found.{" "}
                          {searchQuery || categoryFilter !== "all" ? (
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
                      paginatedArticles.map((article) => (
                        <TableRow key={article._id}>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {article.title}
                          </TableCell>
                          <TableCell>
                            {typeof article.category === "object" &&
                            article.category !== null &&
                            "name" in article.category
                              ? (article.category as Category).name
                              : article.category}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                getStatusBadgeVariant(article.status) as any
                              }
                            >
                              {article.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {article.language === "en" ? "English" : "Bangla"}
                          </TableCell>
                          <TableCell>
                            {article.publishDate
                              ? new Date(
                                  article.publishDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </TableCell>
                          {/* Trending Toggle */}
                          <TableCell className="text-center">
                            <Switch
                              checked={Boolean(article.isTrending)}
                              onCheckedChange={(checked) =>
                                handleToggleTrending(article._id, checked)
                              }
                              disabled={isLoading}
                            />
                          </TableCell>
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
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/news/${article._id}`}
                                    target="_blank"
                                  >
                                    <Eye className="mr-2 h-4 w-4" /> View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/articles/${article._id}`}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(article._id)}
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
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
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
