"use client";

import React, { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast"; // For showing notifications
import { Switch } from "@/components/ui/switch";
import { usePostWithFiles } from "@/hooks/useApi"; // API hook to handle post requests
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { LoadingSpinner } from "@/components/loading-spinner";

const CreateVideoPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    videoId: "",
    isActive: true,
  });

  const { mutate: createVideo, isPending } = usePostWithFiles("/video/create", [
    "video",
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.videoId) {
      toast.error("Please enter a YouTube Video ID.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return; // Ensure form validation before submitting

    try {
      await createVideo(formData); // This function will call your API to upload data
      toast.success("Video uploaded successfully.");
      router.push(`/${user?.role}/multimedia`);
      // Reset form after successful upload
      setFormData({
        title: "",
        videoId: "",
        isActive: true,
      });
    } catch (error) {
      toast.error("Failed to upload video. Please try again.");
    }
  };

  return (
    <Suspense fallback={<LoadingSpinner />}> <div className="space-y-6 w-full">
      <h1 className="text-3xl font-bold">Upload YouTube Video</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-3">
          <Label className="text-xl" htmlFor="title">
            Video Title
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter Video Title"
          />
        </div>

        {/* YouTube Video ID */}
        <div className="space-y-3">
          <Label className="text-xl" htmlFor="videoId">
            YouTube Video ID
          </Label>
          <Input
            id="videoId"
            name="videoId"
            value={formData.videoId}
            onChange={handleInputChange}
            placeholder="Enter YouTube Video ID"
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
          {isPending ? "Uploading..." : "Upload Video"}
        </Button>
      </form>
    </div></Suspense>
   
  );
};

export default CreateVideoPage;
