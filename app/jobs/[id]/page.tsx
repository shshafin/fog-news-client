"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi, usePostWithFiles } from "@/hooks/useApi";
import { getImageUrl } from "@/hooks/useGetImage";
import { IJobPost } from "@/lib/content-models";
import {
  Building2,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  GraduationCap,
  MapPin,
  Star,
  Upload,
  Users,
  Briefcase,
  Share2,
  Bookmark,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Globe,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

// Loading skeleton component
const JobPageSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
    <Header />
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <Skeleton className="w-32 h-32 rounded-2xl" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
            <Skeleton className="h-12 w-32" />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

// Error state component
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
    <Header />
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="pt-6">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Job Not Found</h3>
          <p className="text-muted-foreground mb-6">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={onRetry}>
              Try Again
            </Button>
            <Button asChild>
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    <Footer />
  </div>
);

function SingleJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const [jobDetails, setJobDetails] = useState<IJobPost | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobs, setJobs] = useState<IJobPost[]>([]);
  const { data: allJobs } = useApi(["jobs"], "/jobs");
  useEffect(() => {
    if (allJobs) {
      setJobs(allJobs as IJobPost[]);
    }
  }, [allJobs]);

  console.log(jobs, "all jobs");

  const { mutate: createJobsApplications } = usePostWithFiles(
    "/job-applications",
    ["job-applications"]
  );

  const { data, isLoading, error, refetch } = useApi<IJobPost>(
    ["jobs", id],
    `/jobs/${id}`,
    !!id
  );

  const [applicationData, setApplicationData] = useState({
    jobPost: id,
    applicantName: "",
    applicantEmail: "",
    phone: "",
    coverLetter: "",
    status: "submitted",
    appliedDate: new Date(),
    emailStatus: "pending",
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setApplicationData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0] || null;
      setFile(selectedFile);
    },
    []
  );

  const resetForm = useCallback(() => {
    setApplicationData({
      jobPost: id,
      applicantName: "",
      applicantEmail: "",
      phone: "",
      coverLetter: "",
      status: "submitted",
      appliedDate: new Date(),
      emailStatus: "pending",
    });
    setFile(null);
  }, [id]);

  const handleSubmitApplication = async () => {
    if (
      !applicationData.applicantName ||
      !applicationData.applicantEmail ||
      !file
    ) {
      toast.error("Please fill in all required fields and upload your resume.");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    Object.entries(applicationData).forEach(([key, value]) => {
      if (key === "appliedDate") {
        formData.append(key, (value as Date).toISOString());
      } else {
        formData.append(key, value as string);
      }
    });

    if (file) {
      formData.append("resume", file);
    }

    try {
      await createJobsApplications(formData);
      setIsModalOpen(false);
      resetForm();
      toast.success(
        "Application submitted successfully! We'll be in touch soon."
      );
    } catch (error) {
      toast.error("Error submitting application. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: jobDetails?.title,
          text: `Check out this job opportunity: ${jobDetails?.title} at ${jobDetails?.company}`,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success("Job link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Job link copied to clipboard!");
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
    );
  };

  useEffect(() => {
    if (data) {
      setJobDetails(data);
    }
  }, [data]);

  if (isLoading) {
    return <JobPageSkeleton />;
  }

  if (error || !jobDetails) {
    return <ErrorState onRetry={refetch} />;
  }

  const formatSalary = (salary: string | number) => {
    if (typeof salary === "number") {
      return `৳${salary.toLocaleString("en-BD")}`;
    }
    return salary;
  };

  const isDeadlinePassed =
    new Date(jobDetails.applicationDeadline) < new Date();

  // First, ensure allJobs is an array
  const similarJobs = Array.isArray(allJobs)
    ? allJobs
        .filter(
          (job: any) =>
            job._id !== jobDetails._id && // Exclude current job
            job.category === jobDetails.category &&
            job.jobType === jobDetails.jobType
        )
        .slice(0, 3)
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <span>/</span>
          <Link
            href="/jobs"
            className="hover:text-foreground">
            Jobs
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-xs">
            {jobDetails.title}
          </span>
        </div>

        {/* Job Header */}
        <Card className="overflow-hidden shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-slate-700 p-3 border">
                  <img
                    className="w-full h-full rounded-xl object-contain"
                    src={
                      getImageUrl(jobDetails?.image) ||
                      "/api/placeholder/128/128"
                    }
                    alt={`${jobDetails?.company} logo`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/api/placeholder/128/128";
                    }}
                  />
                </div>
              </div>

              {/* Job Info */}
              <div className="flex-grow space-y-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 leading-tight">
                    {jobDetails.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <span className="text-lg font-semibold">
                        {jobDetails.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      <span className="font-medium">{jobDetails.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <span className="font-medium">
                        Posted{" "}
                        {new Date(
                          jobDetails.createdAt || Date.now()
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Job Badges */}
                <div className="flex flex-wrap gap-3">
                  <Badge className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {jobDetails.jobType}
                  </Badge>

                  {jobDetails.salary && (
                    <Badge className="px-4 py-2 text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {formatSalary(jobDetails.salary)}
                    </Badge>
                  )}

                  <Badge className="px-4 py-2 text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    <Users className="w-4 h-4 mr-2" />
                    {jobDetails.experienceLevel || "Not specified"}
                  </Badge>

                  <Badge
                    variant={isDeadlinePassed ? "destructive" : "secondary"}
                    className="px-4 py-2 text-sm font-medium">
                    <Calendar className="w-4 h-4 mr-2" />
                    {isDeadlinePassed
                      ? "Deadline Passed"
                      : `Deadline: ${new Date(
                          jobDetails.applicationDeadline
                        ).toLocaleDateString()}`}
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleBookmark}
                    className="flex items-center gap-2">
                    <Bookmark
                      className={`h-4 w-4 ${
                        isBookmarked ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                <Dialog
                  open={isModalOpen}
                  onOpenChange={setIsModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      disabled={isDeadlinePassed}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isDeadlinePassed ? "Application Closed" : "Apply Now"}
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                        Apply for {jobDetails.title}
                      </DialogTitle>
                      <DialogDescription className="text-slate-600 dark:text-slate-400">
                        Submit your application for this position at{" "}
                        {jobDetails.company}. We'll review it and get back to
                        you soon.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label
                            htmlFor="applicantName"
                            className="text-sm font-semibold">
                            Full Name *
                          </Label>
                          <Input
                            id="applicantName"
                            name="applicantName"
                            placeholder="Enter your full name"
                            value={applicationData.applicantName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="text-sm font-semibold">
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="+880 1XXXXXXX"
                            value={applicationData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="applicantEmail"
                          className="text-sm font-semibold">
                          Email Address *
                        </Label>
                        <Input
                          id="applicantEmail"
                          name="applicantEmail"
                          type="email"
                          placeholder="your.email@example.com"
                          value={applicationData.applicantEmail}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="coverLetter"
                          className="text-sm font-semibold">
                          Cover Letter
                        </Label>
                        <Textarea
                          id="coverLetter"
                          name="coverLetter"
                          placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                          value={applicationData.coverLetter}
                          onChange={handleInputChange}
                          className="min-h-[120px]"
                          rows={5}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="resume"
                          className="text-sm font-semibold">
                          Resume (PDF) *
                        </Label>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <Input
                              id="resume"
                              name="resume"
                              type="file"
                              accept="application/pdf,.pdf"
                              onChange={handleFileChange}
                              required
                            />
                          </div>
                          <Upload className="w-5 h-5 text-slate-400" />
                        </div>
                        {file && (
                          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Selected: {file.name}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setIsModalOpen(false)}
                          disabled={isSubmitting}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmitApplication}
                          disabled={isSubmitting}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          {isSubmitting
                            ? "Submitting..."
                            : "Submit Application"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {jobDetails.description ||
                      "No description provided for this position."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Requirements */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Skills */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Star className="w-5 h-5 text-yellow-600" />
                    Skills Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(jobDetails.skills) &&
                  jobDetails.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {jobDetails.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="px-3 py-1">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 italic">
                      No specific skills listed.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {Array.isArray(jobDetails.requirements) &&
                  jobDetails.requirements.length > 0 ? (
                    <ul className="space-y-2">
                      {jobDetails.requirements.map((requirement, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400 italic">
                      No specific requirements listed.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Job Info */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Job Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Job Type
                    </span>
                    <Badge variant="outline">{jobDetails.jobType}</Badge>
                  </div>

                  {jobDetails.salary && (
                    <>
                      <Separator />
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Salary
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatSalary(jobDetails.salary)}
                        </span>
                      </div>
                    </>
                  )}

                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Experience
                    </span>
                    <span className="font-medium">
                      {jobDetails.experienceLevel || "Not specified"}
                    </span>
                  </div>

                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Deadline
                    </span>
                    <span
                      className={`font-medium ${
                        isDeadlinePassed
                          ? "text-red-600 dark:text-red-400"
                          : "text-slate-900 dark:text-slate-100"
                      }`}>
                      {new Date(
                        jobDetails.applicationDeadline
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="w-5 h-5 text-green-600" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 block mb-1">
                    Company Name
                  </span>
                  <span className="font-semibold text-lg text-slate-900 dark:text-slate-100">
                    {jobDetails.company}
                  </span>
                </div>

                <Separator />

                <div>
                  <span className="text-sm text-slate-600 dark:text-slate-400 block mb-1">
                    Location
                  </span>
                  <span className="font-medium flex items-center gap-2 text-slate-900 dark:text-slate-100">
                    <MapPin className="w-4 h-4 text-green-600" />
                    {jobDetails.location}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Education Requirements */}
            {Array.isArray(jobDetails.education) &&
              jobDetails.education.length > 0 && (
                <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                      Education Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {jobDetails.education.map((edu, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm">
                          <GraduationCap className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

            {/* Share & Actions */}
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Share this Job</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex-1">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleBookmark}
                    className="flex-1">
                    <Bookmark
                      className={`w-4 h-4 mr-2 ${
                        isBookmarked ? "fill-current" : ""
                      }`}
                    />
                    {isBookmarked ? "Saved" : "Save"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Jobs Section */}

        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Similar Jobs</CardTitle>
            <CardDescription>
              Other opportunities you might be interested in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {similarJobs.length > 0 ? (
              <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {similarJobs.map((job: any) => (
                  <Card
                    key={job._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-transform transform hover:-translate-y-1 cursor-pointer overflow-hidden">
                    <CardHeader className="px-6 pt-6">
                      <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        {job.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {job.company}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {job.location}
                      </p>
                      {job.salary && (
                        <p className="mt-2 text-green-600 font-medium">
                          {job.salary}
                        </p>
                      )}
                      <Badge
                        variant="secondary"
                        className="mt-3 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold">
                        {job.jobType}
                      </Badge>
                    </CardContent>
                    <CardFooter className="px-6 pb-6">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm">
                        View Job &rarr;
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 dark:text-gray-500">
                <Briefcase className="h-14 w-14 mx-auto mb-6 opacity-50" />
                <p className="text-lg font-medium mb-4">
                  No similar jobs found.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="mt-4">
                  <Link
                    href="/jobs"
                    className="text-blue-600 dark:text-blue-400 font-semibold">
                    Browse All Jobs
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </main>
  );
}

export default SingleJobPage;
