"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  Users,
  Briefcase,
  ChevronDown,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import JobCard from "@/components/job-card";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useApi } from "@/hooks/useApi";
import { IJobPost } from "@/lib/content-models";

// Job skeleton component for better loading experience
const JobSkeleton = () => (
  <Card className="overflow-hidden">
    <CardHeader className="pb-3">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-18" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Error state component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="col-span-full">
    <Card className="border-destructive/20">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
          <AlertCircle className="h-16 w-16 text-destructive" />
          <div>
            <h3 className="font-semibold text-xl">Unable to load jobs</h3>
            <p className="text-muted-foreground mt-2">
              There was an error loading the job listings. Please try again.
            </p>
          </div>
          <Button
            onClick={onRetry}
            className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

// Empty state component
const EmptyState = ({
  searchTerm,
  selectedType,
  selectedLocation,
}: {
  searchTerm: string;
  selectedType: string;
  selectedLocation: string;
}) => (
  <div className="col-span-full">
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
          <Briefcase className="h-16 w-16 text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-xl">No jobs found</h3>
            <p className="text-muted-foreground mt-2">
              {searchTerm ||
              selectedType !== "all" ||
              selectedLocation !== "all"
                ? "Try adjusting your search criteria or filters"
                : "No job listings are currently available"}
            </p>
          </div>
          {(searchTerm ||
            selectedType !== "all" ||
            selectedLocation !== "all") && (
            <Button
              variant="outline"
              onClick={() => window.location.reload()}>
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function JobsPage() {
  const [jobs, setJobs] = useState<IJobPost[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, error, refetch } = useApi(["jobs"], "/jobs");

  useEffect(() => {
    if (data) {
      setJobs(data as IJobPost[]);
    }
  }, [data]);

  // Memoized filtered and sorted jobs for better performance
  const filteredJobs = useMemo(() => {
    let filtered = jobs.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "all" || job.jobType === selectedType;
      const matchesLocation =
        selectedLocation === "all" || job.location === selectedLocation;

      return matchesSearch && matchesType && matchesLocation;
    });

    // Sort jobs
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
        );
        break;
      case "title":
        filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        break;
      case "company":
        filtered.sort((a, b) =>
          (a.company || "").localeCompare(b.company || "")
        );
        break;
    }

    return filtered;
  }, [jobs, searchTerm, selectedType, selectedLocation, sortBy]);

  // Get unique job types and locations for filters
  const jobTypes = useMemo(() => {
    const types = [...new Set(jobs.map((job) => job.jobType).filter(Boolean))];
    return types;
  }, [jobs]);

  const jobLocations = useMemo(() => {
    const locations = [
      ...new Set(jobs.map((job) => job.location).filter(Boolean)),
    ];
    return locations;
  }, [jobs]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedLocation("all");
    setSortBy("newest");
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Briefcase className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Job Opportunities
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover your next career opportunity from our curated job listings
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {jobs.length} Total Jobs
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {jobTypes.length} Job Types
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {jobLocations.length} Locations
              </Badge>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg bg-white/80 dark:bg-slate-700/80"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {filteredJobs.length} of {jobs.length} jobs
                  </span>
                  {(searchTerm ||
                    selectedType !== "all" ||
                    selectedLocation !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Job Type
                    </label>
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {jobTypes.map((type) => (
                          <SelectItem
                            key={type}
                            value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Location
                    </label>
                    <Select
                      value={selectedLocation}
                      onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {jobLocations.map((location) => (
                          <SelectItem
                            key={location}
                            value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Sort By
                    </label>
                    <Select
                      value={sortBy}
                      onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="title">Job Title</SelectItem>
                        <SelectItem value="company">Company Name</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <JobSkeleton key={index} />
            ))
          ) : error ? (
            // Error state
            <ErrorState onRetry={handleRetry} />
          ) : filteredJobs.length === 0 ? (
            // Empty state
            <EmptyState
              searchTerm={searchTerm}
              selectedType={selectedType}
              selectedLocation={selectedLocation}
            />
          ) : (
            // Job cards
            filteredJobs.map((job, index) => (
              <div
                key={job._id || index}
                className="transform transition-all duration-300 hover:scale-105">
                <JobCard job={job} />
              </div>
            ))
          )}
        </div>

        {/* Load More Button (if needed) */}
        {filteredJobs.length > 0 && filteredJobs.length < jobs.length && (
          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Load More Jobs
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
