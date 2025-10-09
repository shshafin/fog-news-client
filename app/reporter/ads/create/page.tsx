"use client";

import React, { Suspense, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { usePostWithFiles } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { LoadingSpinner } from "@/components/loading-spinner";
// Assuming you have a date-picker component

const adTypes = ["banner", "sidebar", "popup"] as const;
const adStatuses = [
  "active",
  "inactive",
] as const;


function AdminAds() {
  const { user } = useAuth()
  const router=useRouter();
  const { mutate: createAdvertisement } = usePostWithFiles("/advertisement", [
    "advertisement", // This will be the key used for cache invalidation
  ]);

  const [form, setForm] = useState({
    title: "aa",
    description: "bb",
    targetUrl: "",
    target: "_blank",
    type: "banner",
    status: "active",
    startDate: new Date(),
    endDate: new Date(),
    priority: 1,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();

    // Append all fields
    data.append("title", form.title);
    data.append("description", form.description);
    data.append("targetUrl", form.targetUrl);
    data.append("target", form.target);
    data.append("type", form.type);
    data.append("status", form.status);
    data.append("startDate", form.startDate.toISOString());
    data.append("endDate", form.endDate.toISOString());
    data.append("priority", form.priority.toString());

    if (imageFile) {
      data.append("image", imageFile);
    }
    createAdvertisement(data);
    toast.success("Created Advertisement Successfully");
     router.push(`/${user?.role}/ads`);
    resetForm();
  };
  const resetForm = () => {
    setImageFile(null)
    setForm({
      title: "aa",
      description: "bb",
      targetUrl: "",
      target: "_blank",
      type: "banner",
      status: "active",
      startDate: new Date(),
      endDate: new Date(),
      priority: 1,
    });
    setImageFile(null);
  };

  return (
    <Suspense fallback={<LoadingSpinner />}> <div className="mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create New Advertisement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
        

            <div>
              <Label>Target URL</Label>
              <Input
                value={form.targetUrl}
                onChange={(e) => handleChange("targetUrl", e.target.value)}
              />
            </div>

            <div>
              <Label>Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {imageFile && (
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="mt-2 h-32 rounded border object-cover"
                />
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(val) => handleChange("type", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {adTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(val) => handleChange("status", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {adStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <DatePicker
                  date={form.startDate}
                  onChange={(date: Date | undefined) =>
                    handleChange("startDate", date)
                  }
                />
              </div>
              <div>
                <Label>End Date</Label>
                <DatePicker
                  date={form.endDate}
                  onChange={(date: Date | undefined) =>
                    handleChange("endDate", date)
                  }
                />
              </div>
            </div>

        

            <Button type="submit">Submit Advertisement</Button>
          </form>
        </CardContent>
      </Card>
    </div></Suspense>
   
  );
}

export default AdminAds;
