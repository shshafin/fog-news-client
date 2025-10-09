"use client";
import { IArticle } from "@/lib/content-models";
import React, { useEffect, useState } from "react";
import UseAxiosPublic from "@/hooks/UseAxiosPublic";
import { Card, CardContent, CardFooter } from "../ui/card";
import Image from "next/image";
import { getImageUrl } from "@/hooks/useGetImage";
import { Clock } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Badge } from "../ui/badge";
function SingleCategory({ slug }: { slug: string }) {
  const [news, setNews] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");

  // useEffect(() => {
  //   setIsLoading(true);
  //   const fetchData = async () => {
  //     try {
  //       const axiosInstance = UseAxiosPublic();
  //       const res = await axiosInstance.get(`/news/category/${slug}`);
  //       setNews(res.data);

  //       // Set the title from the first article's category name
  //       const titleData = res.data
  //         .slice(0, 1)
  //         .map((item: { category: { name: string } }) => {
  //           return item.category.name;
  //         });
  //       setTitle(titleData);

  //       setIsLoading(false);
  //     } catch (error) {
  //       setIsLoading(false);
  //       toast.error("Error fetching articles. Please try again later.");
  //     }
  //   };

  //   fetchData();
  // }, [slug]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const axiosInstance = UseAxiosPublic();
        const res = await axiosInstance.get(`/news/category/${slug}`);

        // sort by publishDate (newest first)
        const sorted = [...res.data].sort(
          (a: any, b: any) =>
            new Date(b?.publishDate).getTime() -
            new Date(a?.publishDate).getTime()
        );

        setNews(sorted);

        // Set the title from the first article's category name
        const titleData = sorted[0]?.category?.name || "";
        setTitle(titleData);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error("Error fetching articles. Please try again later.");
      }
    };

    fetchData();
  }, [slug]);

  return (
    <section className="mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="border-l-4 border-red-600 pl-2">{title}</span>
        </h2>
        {news.length > 3 && (
          <p className="font-semibold bg-red-500 py-2 px-3 rounded-lg text-white cursor-pointer">
            <Link href={`/category/${slug}`}>See More</Link>
          </p>
        )}
      </div>
      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.slice(0, 6).map((article) => (
            <Card
              key={article._id}
              className="overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={
                    article.media?.[0]
                      ? getImageUrl(article.media[0])
                      : "/placeholder.svg"
                  }
                  alt={article.title}
                  fill
                  className="object-cover"
                />
                {/* <Badge className="absolute top-2 left-2" variant="secondary">
                  {article?.category?.slug }
                </Badge> */}
              </div>
              <CardContent className="p-4">
                <Link href={`/news/${article._id}`}>
                  <h3 className="text-lg font-bold mb-2 hover:text-red-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {article.subTitle}
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.publishDate?.slice(0, 10)}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No Category News found</h3>
          <p className="text-muted-foreground">
            Check back later for updates in this category
          </p>
        </div>
      )}
    </section>
  );
}

export default SingleCategory;
