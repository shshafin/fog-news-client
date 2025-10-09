"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Calendar, Clock, Share2, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useApi, usePost } from "@/hooks/useApi";
import { Comment, IArticle } from "@/lib/content-models";
import { getImageUrl } from "@/hooks/useGetImage";
import { useLanguage } from "@/providers/language-provider";

const Header = dynamic(() => import("@/components/header"), { ssr: false });
const Footer = dynamic(() => import("@/components/footer"), { ssr: false });
const NewsGrid = dynamic(() => import("@/components/news-grid"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});
const SideBarAddPage = dynamic(() => import("@/components/sidebar-ads"), {
  ssr: false,
});

export default function NewsDetailPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [article, setArticle] = useState<IArticle | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");

  const { data, isLoading } = useApi<IArticle>(
    ["news", id],
    `/news/${id}`,
    !!id
  );
  const { data: articles } = useApi<IArticle[]>(["news"], `/news`, !!id);
  const mutation = usePost<any, any>("/comment/create", ["comment"]);
  const { mutate: createComment, isPending: isCommentLoading } = mutation;

  const { data: commentsData } = useApi<Comment>(
    ["comment", id],
    `/comment/${id}`,
    !!id
  );

  useEffect(() => {
    if (data) {
      setArticle(data);
    }
  }, [data]);

  useEffect(() => {
    if (commentsData) {
      setComments(Array.isArray(commentsData) ? commentsData : [commentsData]);
    }
  }, [commentsData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  }, []);

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  }, []);

  const handleAddComment = useCallback(() => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    createComment(
      { news: id, comment: newComment },
      {
        onSuccess: () => {
          setNewComment("");
          toast.success("Comment added!");
        },
        onError: () => {
          toast.error("Error adding comment.");
        },
      }
    );
  }, [newComment, id, createComment]);

  const relatedArticles = useMemo(() => {
    if (!articles || !article) return [];
    return articles
      .filter((item) => {
        const articleCategoryId =
          typeof article.category === "object"
            ? article.category._id
            : article.category;
        const itemCategoryId =
          typeof item.category === "object" ? item.category._id : item.category;
        return itemCategoryId === articleCategoryId && item._id !== article._id;
      })
      .slice(0, 2);
  }, [articles, article]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner />
        </div>
        <Footer />
      </main>
    );
  }

  if (!article) {
    return (
      <main className="bg-background">
        <Header />
        <div className="container min-h-screen mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p>
            The article you are looking for does not exist or has been removed.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  const imageUrl = article.media?.[0]
    ? getImageUrl(article.media[0])
    : "/placeholder.svg";
  const categoryName =
    typeof article.category === "object" && article.category?.name
      ? article.category.name
      : "General";

  return (
    <main>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="relative h-64 sm:h-80 md:h-96">
                  <Image
                    src={imageUrl}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="bg-red-600 text-white px-2 py-1 rounded whitespace-nowrap">
                        {categoryName}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{article.publishDate?.slice(0, 10)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(timeSpent)} Reading</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <FacebookShareButton url={currentUrl}>
                        <FacebookIcon
                          size={32}
                          round
                        />
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={currentUrl}
                        title={article.title}>
                        <TwitterIcon
                          size={32}
                          round
                        />
                      </TwitterShareButton>
                      <LinkedinShareButton
                        url={currentUrl}
                        title={article.title}>
                        <LinkedinIcon
                          size={32}
                          round
                        />
                      </LinkedinShareButton>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCopyLink}
                        className="bg-[#48ADED] w-8 h-8 text-white rounded-full hover:bg-[#3a9bd9]">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                    {article.title}
                  </h1>
                  <p className="text-base sm:text-lg text-muted-foreground mb-6">
                    {article.subTitle}
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        {article.author ? article.author.charAt(0) : "?"}
                      </div>
                      <span className="font-medium">
                        {article.author || "Unknown Author"}
                      </span>
                    </div>
                  </div>

                  <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
                    {article.description ? (
                      article.description
                        .split("\n\n")
                        .map((paragraph: string, index: number) => (
                          <p
                            key={index}
                            className="mb-4">
                            {paragraph}
                          </p>
                        ))
                    ) : (
                      <p className="text-muted-foreground">
                        No description available.
                      </p>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <div className="mb-6">
                      <h3 className="text-lg sm:text-xl font-bold mb-4">
                        Comments ({comments.length})
                      </h3>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write your comment..."
                        rows={3}
                        className="w-full p-3 border rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white mb-2"
                      />
                      <div className="text-right">
                        <Button
                          variant="default"
                          onClick={handleAddComment}
                          disabled={isCommentLoading}>
                          {isCommentLoading ? "Adding..." : "Add Comment"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <Card
                          key={comment._id}
                          className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-medium">User</span>
                                <span className="text-sm text-muted-foreground">
                                  {formatDistanceToNow(
                                    new Date(comment.createdAt ?? 0),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </div>
                              <p className="mt-1 break-words text-sm sm:text-base">
                                {comment.comment}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6 lg:space-y-8">
              {relatedArticles.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-lg font-bold mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedArticles.map((relatedArticle) => (
                      <div
                        key={relatedArticle._id}
                        className="flex gap-3">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={
                              relatedArticle.media?.[0]
                                ? getImageUrl(relatedArticle.media[0])
                                : "/placeholder.svg"
                            }
                            alt={relatedArticle.title}
                            fill
                            sizes="80px"
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <a
                            href={`/news/${relatedArticle._id}`}
                            className="font-medium hover:text-red-600 transition-colors line-clamp-2 text-sm sm:text-base">
                            {relatedArticle.title}
                          </a>
                          <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {relatedArticle.publishDate?.slice(0, 10)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {article?.tags && article.tags.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-lg font-bold mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((item, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm">
                        {item}
                      </Button>
                    ))}
                  </div>
                </Card>
              )}

              <SideBarAddPage />
            </div>
          </div>

          <div className="mt-8 sm:mt-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              You May Also Like
            </h2>
            <NewsGrid
              category="all"
              limit={3}
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
