"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/authProvider";
import { useApi } from "@/hooks/useApi";
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
import {
  BadgeCentIcon,
  BaggageClaim,
  BarChart,
  FileEdit,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mail,
  User as UIcon,
} from "lucide-react";
import Link from "next/link";
import { IUser, User } from "@/lib/content-models";
import toast from "react-hot-toast";
import ProtectedRoute from "@/providers/protectedRoute";

function ReporterLayoutContent({ children }: { children: React.ReactNode }) {
  const [activeUser, setActiveUser] = useState<User>({} as User);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { refetch: userFetch } = useApi<User>(
    ["singleUser", user.userEmail],
    `users/${user.userEmail}`
  );

  // Skip layout for login page
  const handleLogout = async () => {
    await logout();
    toast.success("Successfully logged out.");
    router.push("/login");
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.userEmail) {
        const { data: userData } = await userFetch();
        if (userData) {
          setActiveUser(userData);
        }
      }
    };

    fetchUser();
  }, [user.userEmail]);

  useEffect(() => {
    if (user && isAuthenticated) {
      if ((user as IUser)?.role !== "reporter") {
        toast.error("You do not have permission to access the Reporter Panel.");
        handleLogout();
      }
    }
  }, [user, isAuthenticated]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/reporter/dashboard" },
    { icon: FileText, label: "Articles", href: "/reporter/articles" },
    {
      icon: FileEdit,
      label: "Create Article",
      href: "/reporter/articles/create",
    },
    { icon: BarChart, label: "Polls", href: "/reporter/polls" },
    { icon: HelpCircle, label: "Quizzes", href: "/reporter/quizzes" },
    { icon: FileText, label: "E-Paper", href: "/reporter/epaper" },
    { icon: FileText, label: "Multimedia", href: "/reporter/multimedia" },

    { icon: BaggageClaim, label: "Jobs", href: "/reporter/jobs" },
    {
      icon: BadgeCentIcon,
      label: "Applications",
      href: "/reporter/applications",
    },
    { icon: LayoutTemplate, label: "Ads", href: "/reporter/ads" },
    { icon: Mail, label: "Newsletter", href: "/reporter/newsletter" },
     { icon: UIcon, label: "My Profile", href:`/reporter/users/${activeUser._id}` },
  ];

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
            <div className="text-sm text-muted-foreground">Reporter Panel</div>
          </SidebarHeader>
          <SidebarContent className="text-black bg-white">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <a href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4 text-black bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {/* <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                  {activeUser?.firstName?.charAt(0) ?? "U"}
                </div> */}
                <div>
                  <div className="font-medium">{activeUser?.firstName}</div>
                  <div className="text-xs text-muted-foreground">
                    {activeUser?.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <ModeToggle />
                <Button variant="ghost" size="icon" onClick={handleLogout}>
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
                "Reporter Panel"}
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

export default function ReporterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <ReporterLayoutContent>{children}</ReporterLayoutContent>
    </ProtectedRoute>
  );
}
