"use client";

import { useApi, usePatchWithFiles } from "@/hooks/useApi";

import { useState, useEffect, Suspense } from "react";

import toast from "react-hot-toast";

import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { getImageUrl } from "@/hooks/useGetImage";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Category {
  _id?: string;
  name: string;
  slug?: string;
  language?: "en" | "bn";
  isActive?: boolean;
  image?: string;
}

export default function UpdateCategory() {
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    language: "en",
    isActive: true,
    imageFile: null as File | null,
    imagePreview: "",
  });

  const { data, refetch } = useApi<Category>(
    ["single-category", id],
    `/categories/${id}`,
    !!id
  );
  const patchCategory = usePatchWithFiles(
    (id) => `/categories/${id}`,
    ["categories"]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("slug", formData.slug);
    form.append("language", formData.language);
    form.append("isActive", String(formData.isActive));
    if (formData.imageFile) form.append("image", formData.imageFile);

    try {
      // Update category
      await patchCategory.mutateAsync({ id: id, data: form });
      toast.success("Updated The Category");
      router.push(`/${user?.role}/categories`);
    } catch (error) {
      toast.error("Failed to save category. Please try again.");
    }
  };

  useEffect(() => {
    const getSingleCategory = async () => {
      await refetch();
      if (data) {
        setFormData({
          name: data.name,
          slug: data.slug || "",
          language: data.language || "en",
          isActive: data.isActive ?? true,
          imageFile: null,
          imagePreview: data.image ? getImageUrl(data.image) : "",
        });
      }
    };
    getSingleCategory();
    console.log(user);
  }, [id, data]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {" "}
      <div className="mx-auto text-black">
        <h1 className="text-2xl font-semibold mb-4">Add Category</h1>

        <div className="space-y-4 p-4 rounded-lg border border-[#393939]">
          <div>
            <label className="block mb-1">Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-transparent border border-[#393939]"
            />
          </div>

          <div>
            <label className="block mb-1">Slug</label>
            <input
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full p-2 rounded bg-transparent border border-[#393939]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label>Active</label>
          </div>

          <div>
            <label className="block mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="text-white"
            />
            {formData.imagePreview && (
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="mt-2 h-24 rounded-md"
              />
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="bg-[#7135FD] px-4 py-2 rounded text-white"
          >
            Update Category
          </button>
        </div>
      </div>
    </Suspense>
  );
}
