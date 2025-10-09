"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useLanguage } from "@/providers/language-provider";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Share2,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/loading-spinner";
import NewsGrid from "@/components/news-grid";
import { useApi, usePost } from "@/hooks/useApi";
import { Category, Comment, IArticle } from "@/lib/content-models";
import { getImageUrl } from "@/hooks/useGetImage";
import Head from "next/head";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";
import SideBarAddPage from "@/components/sidebar-ads";

export default function NewsDetailPage() {
  const { id } = useParams();
  const { language } = useLanguage();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [article, setArticle] = useState<IArticle>({} as IArticle);
  const [loading, setLoading] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");
  const {
    data,
    isLoading,
    refetch: singleRef,
  } = useApi<IArticle>(["news", id], `/news/${id}`, !!id);
  const { data: articles, refetch: articleRef } = useApi<IArticle[]>(
    ["news"],
    `/news`,
    !!id
  );
  const { mutate: createComment } = usePost("/comment/create", ["comment"]);
  const { data: commentsData, refetch: commentsRef } = useApi<Comment>(
    ["comment", id],
    `/comment/${id}`,
    !!id
  );

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        await articleRef();
        await singleRef();
        if (data) {
          setArticle(data);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching article data.");
        console.error(error);
      }
    };
    fetchArticle();
  }, [id, language, data]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        await commentsRef();
        if (commentsData) {
          setComments(
            Array.isArray(commentsData) ? commentsData : [commentsData]
          );
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching comments.");
        console.error(error);
      }
    };
    fetchComments();
  }, [id, language, commentsData]);

  const handleAddComment = () => {
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
        onError: (error: any) => {
          toast.error("Error adding comment.");
          console.error(error);
        },
      }
    );
  };

  useEffect(() => {
    const start = Date.now(); // Record the time when the page loads

    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - start) / 1000)); // Update every second
    }, 1000); // 1000ms = 1 second

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);
  // Convert seconds to a more readable format (hh:mm:ss)
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href); // Set current URL after component has mounted
    }
    // console.log(facebookShare);
  }, []);

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
      <main className=" bg-background">
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
  // console.log("article", article);
  // console.log("articles", articles);
  return (
    <main>
      <Header />
      <div className="min-h-screen bg-background">
        <Head>
          <title>
            {article?.seo?.metaTitle || article?.title || "News Detail"}
          </title>
          <meta
            name="description"
            content={
              article?.seo?.metaDescription ||
              article?.subTitle ||
              "Read the latest news article"
            }
          />
          <meta
            property="og:title"
            content={article?.seo?.metaTitle || article?.title}
          />
          <meta
            property="og:description"
            content={article?.seo?.metaDescription || article?.subTitle}
          />
          <meta
            property="og:title"
            content={article?.seo?.metaTitle || article?.title}
          />
          <meta
            property="og:description"
            content={article?.seo?.metaDescription || article?.subTitle}
          />
          <meta
            property="og:image"
            content={
              article.media?.[0]
                ? getImageUrl(article.media[0])
                : "/placeholder.svg"
            }
          />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:type" content="article" />
          <meta property="og:site_name" content="Your Site Name" />
          <meta
            property="og:image"
            content={
              article.media?.[0]
                ? getImageUrl(article.media[0])
                : "/placeholder.svg"
            }
          />
        </Head>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="overflow-hidden">
                <div className="relative h-96">
                  <Image
                    src={
                      article.media?.[0]
                        ? getImageUrl(article.media[0])
                        : "/placeholder.svg"
                    }
                    alt={article?.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground ">
                      {" "}
                      <span className="bg-red-600 text-white px-2 py-1 rounded">
                        {typeof article.category === "object" &&
                        article.category?.name
                          ? article.category.name
                          : "General"}
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
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>

                      <TwitterShareButton
                        url={currentUrl}
                        title={article.title}
                      >
                        <TwitterIcon size={32} round />
                      </TwitterShareButton>

                      <LinkedinShareButton
                        url={currentUrl}
                        title={article.title}
                      >
                        <LinkedinIcon size={32} round />
                      </LinkedinShareButton>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCopyLink}
                        className="bg-[#48ADED] w-8 h-8 text-white rounded-full"
                      >
                        <Share2 className="w-full h-full" />
                      </Button>
                    </div>
                  </div>

                  <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
                  <p className="text-lg text-muted-foreground mb-6">
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

                  <div className="prose dark:prose-invert max-w-none">
                    {article.description ? (
                      article.description
                        .split("\n\n")
                        .map((paragraph: string, index: number) => (
                          <p key={index}>{paragraph}</p>
                        ))
                    ) : (
                      <p className="text-muted-foreground">
                        No description available.
                      </p>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-2">
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
                        <Button variant="default" onClick={handleAddComment}>
                          Add Comment
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <Card key={comment._id} className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">User</span>
                                <span className="text-sm text-muted-foreground">
                                  {formatDistanceToNow(
                                    new Date(comment.createdAt ?? 0),
                                    { addSuffix: true }
                                  )}
                                </span>
                              </div>
                              <p className="mt-1">{comment.comment}</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="p-4">
                <h3 className="text-lg font-bold mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {articles &&
                    articles
                      .filter((item) =>
                        typeof article.category === "object"
                          ? typeof item.category === "object"
                            ? item.category._id === article.category._id
                            : item.category === article.category._id
                          : item.category === article.category
                      )
                      .slice(0, 2)
                      .map((relatedArticle) => (
                        <div key={relatedArticle._id} className="flex gap-3">
                          <div className="relative w-20 h-20 flex-shrink-0">
                            <Image
                              src={
                                relatedArticle.media?.[0]
                                  ? getImageUrl(relatedArticle.media[0])
                                  : "/placeholder.svg"
                              }
                              alt={relatedArticle.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <a
                              href={`/news/${relatedArticle._id}`}
                              className="font-medium hover:text-red-600 transition-colors line-clamp-2"
                            >
                              {relatedArticle.title}
                            </a>
                            <div className="text-sm text-muted-foreground mt-1">
                              {article.publishDate?.slice(0, 10)}
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="text-lg font-bold mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article?.tags?.map((item, i) => (
                    <Button key={i} variant="outline" size="sm">
                      {item}
                    </Button>
                  ))}
                </div>
              </Card>

              <SideBarAddPage />
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <NewsGrid category="all" limit={3} />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
