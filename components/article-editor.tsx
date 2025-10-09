/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import type { Category, User } from "@/lib/content-models";
import { useAuth } from "@/providers/authProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { Clock, Upload, X } from "lucide-react";
import { useApi, usePatchWithFiles, usePostWithFiles } from "@/hooks/useApi";
import { getImageUrl } from "@/hooks/useGetImage";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ArticleEditorProps {
  articleId?: string;
  isAdmin?: boolean;
}

interface IArticle {
  _id: string;
  title: string;
  media?: string[];
  author?: string;
  tags?: string[];
  status?: "draft" | "published" | "archived";
  feature?: boolean;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  category: string | Category;
  publishDate?: string;
  subTitle?: string;
  description?: string;
  language?: string;
}

export default function ArticleEditor({
  articleId,
  isAdmin,
}: ArticleEditorProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { mutate: createArticle } = usePostWithFiles("/news/create", [
    "article",
  ]);
  const { data, refetch } = useApi<IArticle>(
    ["news", articleId],
    `/news/${articleId}`,
    !!articleId
  );
  const { data: categoriesData, refetch: categoryRef } = useApi<Category[]>(
    ["categories"],
    "/categories"
  );
  const patchArticle = usePatchWithFiles(
    (id) => `/news/${id}`,
    ["news", articleId]
  );
  const { refetch: userFetch } = useApi<User>(
    ["singleUser", user.userEmail],
    `users/${user.userEmail}`
  );

  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    imageFiles: [] as File[],
    imagePreviews: [] as string[],
    category: "",
    selectedTags: [] as string[],
    author: "Anonymous",
    status: "published",
    publishDate: new Date(),
    feature: false,
    language: "en" as "en" | "bn",
    metaTitle: "",
    metaDescription: "",
    newTag: "",
  });

  const updateField = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      imageFiles: files,
      imagePreviews: previews,
    }));
  };

  const handleSave = async (saveStatus: "published", isAutosave = false) => {
    if (!formData.title) {
      toast.error("Title is required.");
      return;
    }
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.content);
    form.append("subTitle", formData.excerpt);
    form.append("author", formData.author);
    form.append("category", formData.category);
    form.append("status", saveStatus);
    form.append("language", formData.language);
    form.append("feature", String(formData.feature));
    form.append("publishDate", new Date().toISOString());
    form.append("seo[metaTitle]", formData.metaTitle);
    form.append("seo[metaDescription]", formData.metaDescription);
    formData.selectedTags.forEach((tag, i) => form.append(`tags[${i}]`, tag));
    formData.imageFiles.forEach((file) => form.append("images", file));
    try {
      if (articleId) {
        patchArticle.mutate({ id: articleId, data: form });
        toast.success("Updated Article Successfully");
        router.push(`/${user?.role}/articles`);
        resetForm();
        await refetch();
      } else {
        createArticle(form);
        toast.success("Created Article Successfully");
        router.push(`/${user?.role}/articles`);
        resetForm();
      }
      resetForm();
      setLastSaved(new Date());
    } catch (error) {
      toast.error("Failed to save article. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData((prev) => ({
      ...prev,
      title: "",
      excerpt: "",
      content: "",
      imageFiles: [] as File[],
      imagePreviews: [] as string[],
      category: "",
      selectedTags: [] as string[],
      author: "Anonymous",
      status: "published",
      publishDate: new Date(),
      feature: false,
      language: "en" as "en" | "bn",
      metaTitle: "",
      metaDescription: "",
      newTag: "",
    }));
  };

  useEffect(() => {
    if (articleId) {
      const getSingleArticle = async () => {
        await refetch();
        if (data) {
          const previews = data.media
            ? data.media.map((file) => getImageUrl(file))
            : [];
          setFormData((prev) => ({
            ...prev,
            title: data.title ?? "",
            excerpt: data.subTitle ?? "",
            content: data.description ?? "",
            category:
              typeof data.category === "string"
                ? data.category
                : data.category?._id ?? "",
            selectedTags: data.tags ?? [],
            author: data.author ?? prev.author,
            status: data.status ?? prev.status,
            publishDate: data.publishDate
              ? new Date(data.publishDate)
              : prev.publishDate,
            feature: data.feature ?? prev.feature,
            language: (data.language as "en" | "bn") ?? prev.language,
            metaTitle: data.seo?.metaTitle ?? "",
            metaDescription: data.seo?.metaDescription ?? "",
            imagePreviews: previews,
           
          }));
        }
      };
      getSingleArticle();
    }
  }, [articleId, refetch, data]);

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData, categoryRef]);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.userEmail) {
        const { data: userData } = await userFetch();
        if (userData) {
          const fullName = `${userData.firstName ?? ""} ${
            userData.lastName ?? ""
          }`.trim();
          setFormData((prev) => ({
            ...prev,
            author: fullName || "Anonymous",
          }));
        }
      }
    };

    fetchUser();
  }, [user.userEmail]); // keep only this dependency

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {articleId ? "Edit Article" : "Create Article"}
        </h1>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <div className="text-sm text-muted-foreground flex items-center">
              <Clock className="mr-1 h-3 w-3" /> Last saved:{" "}
              {format(lastSaved, "HH:mm:ss")}
            </div>
          )}
          <Button onClick={() => handleSave("published")}>
            {articleId ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
              />

              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                rows={3}
              />

              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => updateField("content", e.target.value)}
                rows={10}
              />

              <Label htmlFor="tag">Article Tags</Label>
              <div className="flex flex-wrap gap-2">
                {formData.selectedTags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-muted text-sm px-2 py-1 rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-2 hover:text-red-500"
                      onClick={() => {
                        const updated = [...formData.selectedTags];
                        updated.splice(idx, 1);
                        updateField("selectedTags", updated);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Input
                  id="tag"
                  value={formData.newTag}
                  onChange={(e) => updateField("newTag", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const newTag = formData.newTag.trim();
                      if (newTag && !formData.selectedTags.includes(newTag)) {
                        updateField("selectedTags", [
                          ...formData.selectedTags,
                          newTag,
                        ]);
                        updateField("newTag", "");
                      }
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={() => {
                    const newTag = formData.newTag.trim();
                    if (newTag && !formData.selectedTags.includes(newTag)) {
                      updateField("selectedTags", [
                        ...formData.selectedTags,
                        newTag,
                      ]);
                      updateField("newTag", "");
                    }
                  }}
                >
                  Add Tag
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => updateField("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Label>Featured Article</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.feature}
                      onCheckedChange={(v) => updateField("feature", v)}
                    />
                    <span>{formData.feature ? "Yes" : "No"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 space-y-4">
                  <Label>Featured Images</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.imagePreviews.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-video bg-muted rounded-md overflow-hidden"
                      >
                        <img
                          src={src}
                          alt={`preview-${idx}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            const newFiles = [...formData.imageFiles];
                            const newPreviews = [...formData.imagePreviews];
                            newFiles.splice(idx, 1);
                            newPreviews.splice(idx, 1);
                            updateField("imageFiles", newFiles);
                            updateField("imagePreviews", newPreviews);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <label>
                      <Upload className="mr-2 h-4 w-4" /> Upload Images
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => updateField("metaTitle", e.target.value)}
              />
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => updateField("metaDescription", e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
