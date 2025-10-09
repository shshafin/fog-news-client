import { Suspense } from "react"
import Header from "@/components/header"
import NewsGrid from "@/components/news-grid"
import Footer from "@/components/footer"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function OpinionPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <NewsGrid category="opinion" />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
