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
import { useApi, usePost } from "@/hooks/useApi";
import { User } from "@/lib/content-models";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ForgotPasword() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: forGotPassword } = usePost("/auth/forgot-password", ["auth"]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await forGotPassword({ email: email });
      toast.success("We Have Sent New Password To Your Email Please Check", {
        duration: 10000,
        position: "top-center",
        style: {
          border: "1px solid #4ade80", // green border
          padding: "16px",
          color: "#065f46",
        },
      });
      setEmail("");
      router.push("/login");
      setIsLoading(false);
    } catch (error) {
      toast.error("Failed to Send Password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <Card className="w-full max-w-md">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h1 className="text-center text-2xl font-bold pt-3">
              Enter Your Email Address
            </h1>
            <div className="space-y-2">
              <Input
                id="email"
                type="email"
                placeholder="admin@thefognews.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send"
            )}
          </Button>
          <p className="text-center">
            <Link href={"/login"}>Go To The Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
