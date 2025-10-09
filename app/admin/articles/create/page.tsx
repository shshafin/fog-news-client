import ArticleEditor from "@/components/article-editor";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Suspense } from "react";

export default function AdminCreateArticlePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ArticleEditor isAdmin={true} />
    </Suspense>
  );
}
