"use client";

import { useLanguage } from "../providers/language-provider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { getImageUrl } from "@/hooks/useGetImage";

export default function HeroSection() {
  const { language, t } = useLanguage();
  const [featuredNews, setFeaturedNews] = useState<any[]>([]);

  const { data, isLoading, refetch } = useApi(["news"], "/news");

  useEffect(() => {
    const fetchFeaturedNews = async () => {
      await refetch();
      if (data && Array.isArray(data)) {
        const filtered = data.filter((item) => item.feature === true);
        setFeaturedNews(filtered.slice(0, 3));
      }
    };

    fetchFeaturedNews();
  }, [language,data]);

  if (featuredNews.length === 0) {
    return <div className="h-96 bg-muted animate-pulse rounded-lg" />;
  }

  const mainArticle = featuredNews[0];
  const sideArticles = featuredNews.slice(1, 3);

  return (
    <section className="mt-6">
      <h2 className="text-2xl font-bold mb-4">{t("hero.latest")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 overflow-hidden">
          <div className="relative h-96">
            <Image
              src={
                mainArticle.media?.[0]
                  ? getImageUrl(mainArticle.media[0])
                  : "/placeholder.svg"
              }
              alt={mainArticle.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <Badge className="w-fit mb-2" variant="secondary">
                {mainArticle?.category?.slug}
              </Badge>
              <Link href={`/news/${mainArticle.id}`}>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {mainArticle.title}
                </h3>
              </Link>
              <p className="text-white/80 line-clamp-2">
                {mainArticle.subTitle}
              </p>
            </div>
          </div>
        </Card>
        <div className="grid grid-cols-1 gap-4">
          {sideArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              <div className="relative h-44">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                  <Badge className="w-fit mb-1" variant="secondary">
                    {article?.category?.slug}
                  </Badge>
                  <Link href={`/news/${article.id}`}>
                    <h3 className="text-lg font-bold text-white">
                      {article.title}
                    </h3>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
