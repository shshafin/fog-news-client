"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/authProvider";
import { useApi } from "@/hooks/useApi";
import { User } from "@/lib/content-models";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login, error } = useAuth();

  const { isLoading, refetch } = useApi<User>(
    ["singleUser", email],
    `users/${email}`,
    false
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login(email, password);

      if (success) {
        const { data: userData } = await refetch(); // fetch fresh user data
        if (userData) {
          toast.success(`Login To The ${userData.role} Successfully!`);

          // Redirect based on role
          if (userData.role === "admin") {
            router.push("/admin/dashboard");
          } else if (userData.role === "editor") {
            router.push("/editor/dashboard");
          } else if (userData.role === "reporter") {
            router.push("/reporter/dashboard");
          } else {
            toast.error("You do not have permission to access the Dashboard.");
          }
        } else {
          toast.error("User data not available after login.");
        }
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Login To The Dashboard
          </CardTitle>
          <CardDescription>
            Enter your credentials to access the dashboard panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )} */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@thefognews.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="flex justify-end mt-4 text-blue-800">
                <Link href="/forgot">Forgot Password</Link>
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
