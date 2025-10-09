"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";

interface MultimediaEmptyProps {
  language: string;
}

export function MultimediaEmpty({ language }: MultimediaEmptyProps) {
  return (
    <Card className="w-full border-dashed border-2 border-muted-foreground/20">
      <CardContent className="p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 bg-muted/30 rounded-full flex items-center justify-center">
          <Video className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {language === "en" ? "No Videos Available" : "কোন ভিডিও উপলব্ধ নেই"}
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {language === "en"
            ? "Our multimedia team is working to bring you the latest video content. Check back soon for updates."
            : "আমাদের মাল্টিমিডিয়া টিম আপনার জন্য সর্বশেষ ভিডিও কন্টেন্ট নিয়ে আসার জন্য কাজ করছে। আপডেটের জন্য শীঘ্রই আবার দেখুন।"}
        </p>
      </CardContent>
    </Card>
  );
}
