"use client";

import { useLanguage } from "../providers/language-provider";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Clock, Share2 } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { getImageUrl } from "@/hooks/useGetImage";

interface NewsGridProps {
  category: string;
  limit?: number;
}

export default function NewsGrid({ category, limit }: NewsGridProps) {
  const { language, t } = useLanguage();
  const [news, setNews] = useState<any[]>([]);
  const { data, isLoading, refetch } = useApi(["news"], "/news");

  const sectionTitle =
    category === "featured"
      ? t("section.featured")
      : category === "latest"
      ? t("section.latest")
      : category === "all"
      ? t("nav.news")
      : t(`nav.${category}`);
  useEffect(() => {
    const fetchData = async () => {
      await refetch();
    };
    fetchData();
    if (data) {
      const filteredNews = (Array.isArray(data) ? data : []).filter(
        (article: any) => {
          if (category === "featured") return article.feature;
          if (category === "latest") return true;
          if (category === "all") return true;
          return article.category === category;
        }
      );

      const limitedNews = limit ? filteredNews.slice(0, limit) : filteredNews;
      // console.log("Filtered News:", limitedNews);
      setNews(limitedNews);
    }
  }, [data, category, limit]); // ✅ react when data is ready

  return (
    <section className="mt-6">
     
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <span className="border-l-4 border-red-600 pl-2">{sectionTitle}</span>
      </h2>
      {news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          {news.map((article) => (
            <Card key={article._id} className="overflow-hidden">
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
                <Badge className="absolute top-2 left-2" variant="secondary">
                  {article?.category?.slug}
                </Badge>
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
          <h3 className="text-lg font-medium mb-2">
            {language === "en"
              ? "No articles found"
              : "কোন নিবন্ধ পাওয়া যায়নি"}
          </h3>
          <p className="text-muted-foreground">
            {language === "en"
              ? "Check back later for updates in this category"
              : "এই বিভাগে আপডেটের জন্য পরে আবার দেখুন"}
          </p>
        </div>
      )}
     
    </section>
  );
}
