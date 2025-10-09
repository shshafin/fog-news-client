"use client";

import {
  useApi,
  useDelete,
  usePostWithFiles,
  usePatchWithFiles,
} from "@/hooks/useApi";
import { getImageUrl } from "@/hooks/useGetImage";
import { useState, useEffect, Suspense } from "react";
import { MoreVertical } from "lucide-react";
import toast from "react-hot-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { useAuth } from "@/providers/authProvider";
import { LoadingSpinner } from "@/components/loading-spinner";

interface Category {
  _id?: string;
  name: string;
  slug?: string;
  language?: "en" | "bn";
  isActive?: boolean;
  image?: string;
}

export default function Categories() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    language: "en",
    isActive: true,
    imageFile: null as File | null,
    imagePreview: "",
  });


  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const { data, isLoading, refetch } = useApi<Category[]>(
    ["categories"],
    "/categories"
  );

  const { mutate: createCategory } = usePostWithFiles("/categories/create", [
    "categories",
  ]);


  const { mutate: deleteCategory } = useDelete(
    (id) => `/categories/${id}`,
    ["categories"]
  );
  // Pagination
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const paginatedCategories = categories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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

  const toggleMenu = (id: string) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      language: "en",
      isActive: true,
      imageFile: null,
      imagePreview: "",
    });
 
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("slug", formData.slug);
    form.append("language", formData.language);
    form.append("isActive", String(formData.isActive));
    if (formData.imageFile) form.append("image", formData.imageFile);

    try {
      // Create new category
      await createCategory(form);
      toast.success("Created The Category");
      await refetch();

      resetForm();
    } catch (error) {
      toast.error("Failed to save category. Please try again.");
    }
  };

  const onDelete = async (cat: Category) => {
    try {
      await deleteCategory(cat._id || "");
      toast.success("Deleted The Category");
      setOpenMenuId(null);
      await refetch();
    } catch (error) {
      toast.error("Failed to delete category. Please try again.");
    }
  };

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  return (
    <Suspense fallback={<LoadingSpinner />}><div className="mx-auto text-black">
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
           Add Category
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-2">Category List</h2>

      <table className="w-full mb-10 text-left rounded border border-[#393939] text-sm">
        <thead>
          <tr>
            <th className="p-2">Image</th>
            <th className="p-2">Name</th>
            <th className="p-2">Slug</th>
            <th className="p-2">Status</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCategories.map((cat) => (
            <tr key={cat._id} className="border-t border-[#393939] relative">
              <td className="p-2">
                {cat.image && (
                  <img
                    src={getImageUrl(cat.image)}
                    alt={cat.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
              </td>
              <td className="p-2">{cat.name}</td>
              <td className="p-2">{cat.slug}</td>
              <td className="p-2">{cat.isActive ? "Active" : "Inactive"}</td>
              <td className="p-2 text-center relative">
                <button
                  onClick={() => cat._id && toggleMenu(cat._id)}
                  className="p-2 rounded hover:bg-[#2a2a2a]"
                >
                  <MoreVertical className="h-5 w-5 hover:text-white text-black" />
                </button>

                {openMenuId === cat._id && (
                  <div className="absolute right-0 mt-2 w-28 border border-[#393939] rounded-md shadow-md z-20">
                    <ul className="text-sm bg-[#2c2c2c] text-white">
                      <li className="px-4 py-2 hover:bg-[#383838] cursor-pointer">
                        <Link href={`/${user?.role}/categories/${cat?._id}`}>
                          Edit
                        </Link>
                      </li>
                      <li
                        onClick={() => onDelete(cat)}
                        className="px-4 py-2 hover:bg-[#383838] cursor-pointer"
                      >
                        Delete
                      </li>
                    </ul>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={
                    currentPage === 1
                      ? undefined
                      : () => setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
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
                    <PaginationLink onClick={() => setCurrentPage(totalPages)}>
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
      </table>
    </div></Suspense>
    
  );
}
