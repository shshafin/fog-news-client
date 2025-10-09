import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { LanguageProvider } from "@/providers/language-provider";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/authProvider";
import ClientOnly from "@/providers/ClientOnly";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "The Fog News - Latest News and Updates",
  description:
    "Get the latest news, updates, and insights from around the world in both English and Bangla.",
  icons: {
    icon: "/newsicon.png", // ✅ favicon added
  },
  openGraph: {
    title: "The Fog News - Latest News and Updates",
    description:
      "Get the latest news, updates, and insights from around the world in both English and Bangla.",
    url: "https://thechokh.com",
    siteName: "The Fog News",
    images: [
      {
        url: "/newsicon.png",
        width: 1200,
        height: 630,
        alt: "The Fog News",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning>
      <body className={inter.className}>
        <ClientOnly>
          <ThemeProvider>
            <QueryProvider>
              <AuthProvider>
                <LanguageProvider>{children}</LanguageProvider>
                <Toaster position="top-right" />
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
