/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApi, usePatch, usePost } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { User } from "@/lib/content-models";
import { useAuth } from "@/providers/authProvider";
interface UserEditorProps {
  userId?: string;
}
function UserCreate({ userId }: UserEditorProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [changingPass, setchangingPass] = useState(false);
  const {
    mutate: createUser,
    isPending,
    isSuccess,
  } = usePost("/users/create", ["users"]);

  const { data, refetch } = useApi<User>(
    ["users", userId],
    `/users/by/${userId}`,
    !!userId
  );
  const patchUser = usePatch((id) => `/users/${id}`, ["users", userId]);
  const patchUserPassword = usePatch(
    (id) => `/users/update-password/${id}`,
    ["users", userId]
  );
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
    phone: "",
    needsPasswordChange: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = <K extends keyof typeof formData>(
    key: K,
    value: (typeof formData)[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error("All fields are required.");
        return;
      }
    } else {
      if (changingPass) {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match.");
          return;
        }

        if (formData.password.length < 8) {
          toast.error("Password must be at least 8 characters long.");
          return;
        }
      } else {
        if (!formData.firstName || !formData.lastName || !formData.email) {
          toast.error("All fields are required. for id");
          return;
        }
      }
    }

    try {
      if (userId) {
        if (changingPass) {
          await patchUserPassword.mutateAsync({
            id: userId,
            data: { newPassword: formData.password },
          });
          toast.success("User Password Updated Successfully");
          resetFormData();
          router.push(`/${user?.role}/users`);
        } else {
          const updateData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            username: formData.username,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
          };
          await patchUser.mutateAsync({ id: userId, data: updateData });
          toast.success("User Updated Successfully");
          resetFormData();
          router.push(`/${user?.role}/users`);
        }
      } else {
        await createUser(formData);
        toast.success("New User Has Been Created Successfully");
        resetFormData();
        router.push(`/${user?.role}/users`);
      }
    } catch (error) {
      toast.error("Failed to create user. Please try again.");
    }
  };
  const resetFormData = () => {
    setFormData((prev) => ({
      ...prev,
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      role: "admin",
      phone: "",
      needsPasswordChange: true,
    }));
  };
  useEffect(() => {
    if (userId) {
      const getSingleUser = async () => {
        await refetch();
        if (data) {
          setFormData((prev) => ({
            ...prev,
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            username: data.username || "",
            email: data.email || "",
            password: data.password || "",
            role: data.role || "admin",
            language: data.language || "en",
            phone: data.phone || "",
            needsPasswordChange: true,
          }));
        }
      };
      getSingleUser();
    }
  }, [userId, refetch, data]);
  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {userId ? "Update User" : "Create User"}
        </h1>
        <button
          onClick={() => setchangingPass(!changingPass)}
          className="text-xl font-semibold p-2 bg-gray-300 rounded-lg"
        >
          {userId
            ? changingPass
              ? "Update User Data"
              : "Update Only Password"
            : ""}
        </button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {!userId ? (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    placeholder="Enter Your First Name"
                    onChange={(e) => updateField("firstName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    placeholder="Enter Your Last Name"
                    onChange={(e) => updateField("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    placeholder="Enter Your Phone Number"
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="username">User Name</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    placeholder="Enter Your User Name"
                    onChange={(e) => updateField("username", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    placeholder="Enter Your Email"
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => updateField("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="reporter">Reporter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Your Password"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-3 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      placeholder="Confirm Password"
                      onChange={(e) =>
                        updateField("confirmPassword", e.target.value)
                      }
                    />
                    <button
                      type="button"
                      className="absolute top-1/2 right-3 transform -translate-y-1/2"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : !changingPass ? (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    placeholder="Enter Your First Name"
                    onChange={(e) => updateField("firstName", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    placeholder="Enter Your Last Name"
                    onChange={(e) => updateField("lastName", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    placeholder="Enter Your Phone Number"
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="username">User Name</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    placeholder="Enter Your User Name"
                    onChange={(e) => updateField("username", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    placeholder="Enter Your Email"
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => updateField("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="reporter">Reporter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Your Password"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) =>
                      updateField("confirmPassword", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => updateField("language", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="bn">Bangla</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

          <div className="flex items-center gap-2 mt-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className={isPending ? "bg-gray-400" : ""}
            >
              {isPending ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>
                  Loading...
                </span>
              ) : userId ? (
                changingPass ? (
                  "Update Password"
                ) : (
                  "Update User Data"
                )
              ) : (
                "Create User"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserCreate;
