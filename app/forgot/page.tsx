"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Truck } from "lucide-react";
import Link from "next/link";
import { usePost } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
    const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
 const { mutate: forGotPassword } = usePost("/auth/forgot-password", ["auth"]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitted(true);
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
      setIsSubmitted(false);
    } catch (error) {
      toast.error("Failed to Send Password. Please try again.");
      setIsSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Forgot Password?</CardTitle>
          <p className="text-gray-600">
            {isSubmitted ? "Check your email for reset instructions" : "Enter your email to reset your password"}
          </p>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <p className="text-sm text-gray-500">Didn't receive the email? Check your spam folder or try again.</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-blue-600 hover:underline">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
