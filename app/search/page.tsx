"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { mockNewsData } from "@/lib/mock-data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Clock, MessageSquare, Share2 } from "lucide-react";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useLanguage } from "@/providers/language-provider";
import { useApi } from "@/hooks/useApi";
import { IArticle } from "@/lib/content-models";
import { getImageUrl } from "@/hooks/useGetImage";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const langParam = searchParams.get("lang") || "en";
  const { t } = useLanguage();
  const [searchResults, setSearchResults] = useState<IArticle[]>([]);
 const { data, isLoading, refetch } = useApi<IArticle[]>(["news"], "/news");
  useEffect(() => {
    // In a real app, this would be an API call
    // For now, we'll filter the mock data

   if(data){
     setTimeout(async() => {
      await refetch();
      const results = data.filter((item) => {
        const matchesQuery =
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item?.description?.toLowerCase().includes(query.toLowerCase());

        return matchesQuery;
      });

      setSearchResults(results);
    }, 500); // Simulate loading delay
   }
  }, [query, langParam]);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">
          {langParam === "en" ? "Search Results" : "অনুসন্ধানের ফলাফল"}
        </h1>
        <p className="text-muted-foreground mb-6">
          {langParam === "en"
            ? `Found ${searchResults.length} results for "${query}"`
            : `"${query}" এর জন্য ${searchResults.length}টি ফলাফল পাওয়া গেছে`}
        </p>

        {isLoading ? (
          <LoadingSpinner />
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((article) => (
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
                              {typeof article.category === "object" && article.category !== null && "slug" in article.category
                                ? article.category.slug
                                : article.category}
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
                          <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{article.publishDate?.slice(0, 10)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                {/* <MessageSquare className="h-4 w-4" /> */}
                                {/* <span>0</span> */}
                              </div>
                              <Share2 className="h-4 w-4 cursor-pointer hover:text-foreground transition-colors" />
                            </div>
                          </CardFooter>
                        </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">
              {langParam === "en"
                ? "No results found"
                : "কোন ফলাফল পাওয়া যায়নি"}
            </h2>
            <p className="text-muted-foreground">
              {langParam === "en"
                ? "Try different keywords or browse our categories"
                : "অন্য কীওয়ার্ড ব্যবহার করুন বা আমাদের বিভাগগুলি ব্রাউজ করুন"}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
