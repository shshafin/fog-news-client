"use client"

import { useParams } from "next/navigation"
import UserCreate from "@/components/create-user"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Suspense } from "react"

export default function AdminEditUserPage() {
  const { id} = useParams()

  return <Suspense fallback={<LoadingSpinner />}><UserCreate userId={id as string} /></Suspense>
}
