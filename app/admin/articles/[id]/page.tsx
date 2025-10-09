"use client"

import { useParams } from "next/navigation"
import ArticleEditor from "@/components/article-editor"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Suspense } from "react"

export default function AdminEditArticlePage() {
  const { id } = useParams()

  return  <Suspense fallback={<LoadingSpinner />}><ArticleEditor articleId={id as string} isAdmin={true} /></Suspense>
}
