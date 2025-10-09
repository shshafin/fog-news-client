"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import {
  LayoutDashboard,
  FileText,
  BarChart,
  HelpCircle,
  Mail,
  Users,
  LayoutTemplate,
  FileCode,
  LogOut,
  BaggageClaim,
  BadgeCentIcon,
  User as UIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Toaster } from "@/components/ui/toaster";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ProtectedRoute from "@/providers/protectedRoute";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { User, IUser } from "@/lib/content-models";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const [activeUser, setActiveUser] = useState<User>({} as User);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { refetch: userFetch } = useApi<User>(
    ["singleUser", user.userEmail],
    `users/${user.userEmail}`
  );

  useEffect(() => {
    if (user && isAuthenticated) {
      if ((user as IUser)?.role !== "admin") {
        toast.error("You do not have permission to access the Admin Panel.");
        handleLogout();
      }
    }
  }, [user, isAuthenticated]);

  const handleLogout = async () => {
    await logout?.();
    toast.success("Logged out successfully.");
    router.push("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: FileCode, label: "Categories", href: "/admin/categories" },
    { icon: FileText, label: "Articles", href: "/admin/articles" },
    { icon: FileText, label: "E-Paper", href: "/admin/epaper" },
    { icon: FileText, label: "Multimedia", href: "/admin/multimedia" },
    { icon: BarChart, label: "Polls", href: "/admin/polls" },
    { icon: HelpCircle, label: "Quizzes", href: "/admin/quizzes" },
    { icon: BaggageClaim, label: "Jobs", href: "/admin/jobs" },
    { icon: BadgeCentIcon, label: "Applications", href: "/admin/applications" },
    { icon: LayoutTemplate, label: "Ads", href: "/admin/ads" },
    { icon: Mail, label: "Newsletter", href: "/admin/newsletter" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    {
      icon: UIcon,
      label: "My Profile",
      href: activeUser._id ? `/admin/users/${activeUser._id}` : "#",
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.userEmail) {
        const { data: userData } = await userFetch();
        console.log("Fetched user data:", userData); // Debug log
        if (userData) {
          setActiveUser(userData);
        }
      }
    };

    fetchUser();
  }, [user.userEmail, userFetch]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4 text-black bg-white">
            <div className="flex items-center gap-2">
              <div className="font-bold text-xl text-red-600">
                <Link href="/">The Fog News</Link>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Admin Panel</div>
          </SidebarHeader>
          <SidebarContent className="text-black bg-white">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}>
                    <a href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-b p-4 text-black bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div>
                  <div className="font-medium">{activeUser?.firstName}</div>
                  <div className="text-xs text-muted-foreground">
                    {activeUser?.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ModeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center px-4 sticky top-0 bg-background z-10">
            <SidebarTrigger />
            <div className="ml-4 font-medium">
              {menuItems.find((item) => item.href === pathname)?.label ||
                "Admin Panel"}
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ProtectedRoute>
  );
}
