"use client";

import type React from "react";
import { useLanguage } from "../providers/language-provider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, YoutubeIcon } from "lucide-react";
import { usePost } from "@/hooks/useApi";
import toast from "react-hot-toast";
import { FacebookIcon, LinkedinIcon, TwitterIcon } from "react-share";
import Image from "next/image";

export default function Footer() {
  const { t } = useLanguage();
  const { mutate: newSubscribe } = usePost("/news-letter/subscribe", [
    "news-letter",
  ]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    await newSubscribe({ email });
    toast.success("You Have Subscribe successfully!");
    form.reset();
  };

  const quickLinks = [
    { href: "/news", label: "News" },
    { href: "/epaper", label: "E-Paper" },
    { href: "/multimedia", label: "Multimedia" },
    { href: "/weather", label: "Weather" },
    { href: "/jobs", label: "Jobs" },
  ];

  return (
    <footer className="bg-slate-900 text-white mt-8">
      <div className="container mx-auto px-4 py-8">
        {/* Main flex container */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Brand Section */}
          <div className="space-y-3 flex-1 flex flex-col items-center md:items-start">
            <Link
              href="/"
              className="inline-block">
              <Image
                src="/newslogo.png"
                alt="The Fog News Logo"
                width={160}
                height={160}
                className="h-40 w-40 object-contain"
              />
            </Link>
            <p className="text-slate-300 text-sm leading-relaxed max-w-xs text-center md:text-left">
              The Fog News is a bilingual news portal providing the latest news,
              analysis, and multimedia content.
            </p>

            {/* Social Media */}
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="cursor-pointer hover:scale-110 transition-transform">
                <FacebookIcon
                  size={28}
                  round
                />
              </div>
              <div className="cursor-pointer hover:scale-110 transition-transform">
                <TwitterIcon
                  size={28}
                  round
                />
              </div>
              <div className="cursor-pointer hover:scale-110 transition-transform">
                <LinkedinIcon
                  size={28}
                  round
                />
              </div>
              <div className="cursor-pointer hover:scale-110 transition-transform">
                <div className="bg-red-600 rounded-full p-1">
                  <YoutubeIcon
                    className="text-white"
                    size={18}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 flex-1 flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-white">Quick Links</h3>
            <ul className="space-y-1 text-center md:text-left">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3 flex-1 flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-white">
              {t("newsletter.title")}
            </h3>
            <p className="text-slate-300 text-sm text-center md:text-left">
              Stay updated with our latest news.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="space-y-2 w-full max-w-xs">
              <Input
                type="email"
                name="email"
                placeholder={t("newsletter.placeholder")}
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-slate-500"
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2">
                <Send className="h-4 w-4" />
                {t("newsletter.button")}
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 mt-6 pt-4 text-center">
          <p className="text-slate-400 text-sm">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
