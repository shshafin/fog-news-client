"use client";

import React, { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePostWithFiles } from "@/hooks/useApi"; // API hook to handle post requests
import toast from "react-hot-toast"; // For showing notifications
import { Switch } from "@/components/ui/switch";
import { IEpaper } from "@/lib/content-models"; // Interface for ePaper
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { LoadingSpinner } from "@/components/loading-spinner";

const CreateEpaperPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<IEpaper>({
    title: "",
    date: new Date(),
    file: "",
    edition: "",
    isActive: true,
    thumbnail: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null); // State for thumbnail
  const { mutate: createEpaper, isPending } = usePostWithFiles(
    "/epaper/create",
    ["epaper"]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setThumbnail(selectedFile);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!file) {
      toast.error("Please select a PDF file.");
      return false;
    }

    if (!thumbnail) {
      toast.error("Please select a thumbnail image.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return; // Ensure form validation before submitting

    // Prepare the form data to be sent
    const form = new FormData();
    form.append("title", formData.title);
    form.append("date", formData.date.toString()); // Use ISO string format for date
    form.append("file", file!); // Pass PDF file here
    form.append("thumbnail", thumbnail!); // Pass thumbnail image here
    form.append("edition", formData.edition || "");
    form.append("isActive", formData.isActive ? "true" : "false");

    try {
      await createEpaper(form); // This function will call your API to upload data
      toast.success("ePaper uploaded successfully.");
      router.push(`/${user?.role}/epaper`);
      // Reset form after successful upload
      setFormData({
        title: "",
        date: new Date(),
        file: "",
        edition: "",
        isActive: true,
        thumbnail: "", // Reset thumbnail state
      });
      setFile(null); // Reset file state
      setThumbnail(null); // Reset thumbnail state
    } catch (error) {
      toast.error("Failed to upload ePaper. Please try again.");
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {" "}
      <div className="space-y-6 w-full">
        <h1 className="text-3xl font-bold">Upload ePaper</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-3">
            <Label className="text-xl" htmlFor="title">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter ePaper title"
            />
          </div>

          {/* Edition */}
          <div className="space-y-3">
            <Label className="text-xl" htmlFor="edition">
              Edition
            </Label>
            <Input
              id="edition"
              name="edition"
              value={formData.edition || ""}
              onChange={handleInputChange}
              placeholder="Enter Edition (e.g., National)"
            />
          </div>

          {/* PDF Upload */}
          <div>
            <Label className="text-xl" htmlFor="pdfUrl">
              PDF File
            </Label>
            <input
              id="pdfUrl"
              name="pdfUrl"
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full mt-2"
            />
          </div>

          {/* Thumbnail Upload */}
          <div>
            <Label className="text-xl" htmlFor="thumbnail">
              Thumbnail Image
            </Label>
            <input
              id="thumbnail"
              name="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="block w-full mt-2"
            />
          </div>

          {/* Active Status */}
          <div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="isActive" className="text-xl">
                Is Active
              </Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(v) =>
                  setFormData((prev) => ({ ...prev, isActive: v }))
                }
              />
              <span>{formData.isActive ? "Yes" : "No"}</span>
            </div>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isPending}>
            {isPending ? "Uploading..." : "Upload ePaper"}
          </Button>
        </form>
      </div>
    </Suspense>
  );
};

export default CreateEpaperPage;
