import { useAuth } from "@/providers/authProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const {isAuthenticated,user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user && !isAuthenticated) {
      router.replace("/login");
    }
  }, [router, isAuthenticated,user]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
