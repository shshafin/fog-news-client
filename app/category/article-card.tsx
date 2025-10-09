"use client";

import { memo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { IArticle } from "@/lib/content-models";
import { getImageUrl } from "@/hooks/useGetImage";

interface ArticleCardProps {
  article: IArticle;
}

export const ArticleCard = memo(function ArticleCard({
  article,
}: ArticleCardProps) {
  const imageUrl = article.media?.[0]
    ? getImageUrl(article.media[0])
    : "/placeholder.svg";

  const categoryName =
    typeof article.category === "object"
      ? article.category?.slug
      : article.category || "General";

  const publishDate = article.publishDate?.slice(0, 10);

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Badge
          className="absolute top-3 left-3 bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm"
          variant="secondary">
          {categoryName}
        </Badge>
      </div>

      <CardContent className="p-5">
        <Link
          href={`/news/${article._id}`}
          className="block group-hover:text-red-600 transition-colors">
          <h3 className="text-lg font-semibold mb-3 line-clamp-2 leading-tight">
            {article.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {article.subTitle}
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-red-600" />
          <time dateTime={article.publishDate}>{publishDate}</time>
        </div>
      </CardFooter>
    </Card>
  );
});
