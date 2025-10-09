"use client";

import { Suspense, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  Article,
  IQuiz,
  IPoll,
  NewsletterSubscriber,
  IMultimedia,
} from "@/lib/content-models";
import {
  Bar,
  Line,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend,
  BarChart,
  LineChart,
  PieChart,
} from "recharts";
import { useApi } from "@/hooks/useApi";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [multimediaData, setMultimediaData] = useState<IMultimedia[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [pollDatas, setPollDatas] = useState<IPoll[]>([]);
  const { data, isLoading, refetch } = useApi(["news"], "/news");
  const { data: multiData, refetch: multiRef } = useApi<IMultimedia[]>(
    ["video"],
    `/video`
  );
  const { data: newsData, refetch: newsRef } = useApi<NewsletterSubscriber[]>(
    ["news-letter"],
    `/news-letter/subscribers`
  );
  const { data: pollData, refetch: pollRef } = useApi<IPoll[]>(
    ["poll"],
    "/poll"
  );
  // Calculate statistics
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(
    (a) => a.status === "published"
  ).length;

  const englishArticles = articles.filter((a) => a.language === "en").length;
  const banglaArticles = articles.filter((a) => a.language === "bn").length;

  const totalSubscribers = subscribers.length;

  // Prepare chart data
  const articleStatusData = [{ name: "Published", value: publishedArticles }];

  const articleLanguageData = [
    { name: "English", value: englishArticles },
    { name: "Bangla", value: banglaArticles },
  ];

  const categoryData = articles.reduce((acc, article) => {
    const category = article.category;
    const existingCategory = acc.find((item) => item.name === category);

    if (existingCategory) {
      existingCategory.value += 1;
    } else {
      acc.push({ name: category, value: 1 });
    }

    return acc;
  }, [] as { name: string; value: number }[]);

  // Sort categories by count
  categoryData.sort((a, b) => b.value - a.value);



// Example: totalArticles, totalMedia, totalSubscribers
const totalCountArticles:any[] = articles; 
const totalCountMedia:any[] = multimediaData; 
const totalCountSubscribers:any[] =subscribers; 

// Utility: date format YYYY-MM-DD
function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

// Generate date-wise counts for last 7 days
function generateRecentActivityData() {
  const data: { date: string; articles: number; media: number; subscribers: number }[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDate(d);

    const articlesCount = totalCountArticles.filter(a => formatDate(a.createdAt) === dateStr).length;
    const mediaCount = totalCountMedia.filter(m => formatDate(m.createdAt) === dateStr).length;
    const subscribersCount = totalCountSubscribers.filter(s => formatDate(s.createdAt) === dateStr).length;

    data.push({
      date: dateStr,
      articles: articlesCount,
      media: mediaCount,
      subscribers: subscribersCount,
    });
  }

  return data;
}

// Usage
const recentActivityData = generateRecentActivityData();
  // Colors for charts
  const COLORS = [
    "#ef4444",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
  ];
  useEffect(() => {
    const fetchData = async () => {
      await refetch();
      if (Array.isArray(data)) {
        setArticles(data);
      }
    };
    fetchData();
  }, [data, isLoading]);
  useEffect(() => {
    const fetchData = async () => {
      await multiRef();
      if (multiData) {
        setMultimediaData(multiData);
      }
    };
    fetchData();
  }, [multiData]);
  useEffect(() => {
    const fetchData = async () => {
      await newsRef();
      if (newsData) {
        setSubscribers(newsData);
      }
    };
    fetchData();
  }, [newsData]);
  useEffect(() => {
    const fetchData = async () => {
      await pollRef();
      if (pollData) {
        setPollDatas(pollData);
      }
    };
    fetchData();
  }, [pollData]);
  return (
    <Suspense fallback={<LoadingSpinner />}><div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Articles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalArticles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {publishedArticles} published,
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Multimedia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{multiData?.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active Multimedia with user engagement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pollDatas?.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Interactive Polls for user engagement
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Newsletter Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscribers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total email subscribers
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Article Status</CardTitle>
                <CardDescription>
                  Distribution of articles by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={articleStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                        }
                      >
                        {articleStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Language Distribution</CardTitle>
                <CardDescription>Articles by language</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={articleLanguageData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Content Overview</CardTitle>
              <CardDescription>Summary of all content types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Articles", value: totalArticles },
                      { name: "Polls", value: pollDatas.length },
                      { name: "Multimedia", value: multiData?.length },
                      { name: "Subscribers", value: totalSubscribers },
                    ]}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Content creation over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={recentActivityData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="articles"
                      stroke="#ef4444"
                      name="Articles"
                    />
                    <Line
                      type="monotone"
                      dataKey="media"
                      stroke="#3b82f6"
                      name="Multimedia"
                    />
                    <Line
                      type="monotone"
                      dataKey="subscribers"
                      stroke="#10b981"
                      name="Subscribers"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div></Suspense>
    
  );
}
