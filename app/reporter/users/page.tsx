"use client";

import { Suspense, useEffect, useState } from "react";
import type { Article, Category, User } from "@/lib/content-models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Pencil, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useAuth } from "@/providers/authProvider";

const Users = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const { data, isLoading, refetch } = useApi<User>(["users"], "/users");

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "admin":
        return "success";
      case "editor":
        return "success";
      case "reporter":
        return "success";
      default:
        return "default";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
        if (Array.isArray(data)) {
          const myUserData = data.find((item) => item.email === user.userEmail);
          setUsers(myUserData ? [myUserData] : []);
        }
      } catch (error) {
        toast.error("Error fetching users");
      }
    };
    fetchData();
  }, [data, isLoading]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {" "}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Profile Data</h1>
        </div>

        <Card>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>First Name</TableHead>
                      <TableHead>Last Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading Users...
                        </TableCell>
                      </TableRow>
                    ) : (
                      users?.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {user.firstName}
                          </TableCell>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {user.lastName}
                          </TableCell>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusBadgeVariant(user.role) as any}
                            >
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.createdAt?.slice(0, 10) ?? "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/users/${user._id}`}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
};
export default Users;
