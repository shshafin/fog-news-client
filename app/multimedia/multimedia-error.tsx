"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function MultimediaError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center">
          <Card className="w-full max-w-md border-destructive/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Failed to Load Videos
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                We're having trouble loading the multimedia content. Please
                check your connection and try again.
              </p>
              <Button
                onClick={handleRefresh}
                className="bg-red-600 hover:bg-red-700 text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
