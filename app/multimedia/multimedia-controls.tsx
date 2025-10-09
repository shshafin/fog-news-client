"use client";

import { memo } from "react";
import { Filter, Grid, List } from "lucide-react";

interface MultimediaControlsProps {
  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  language: string;
}

export const MultimediaControls = memo(function MultimediaControls({
  rowsPerPage,
  onRowsPerPageChange,
  totalItems,
  startIndex,
  endIndex,
  language,
}: MultimediaControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 p-4 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Filter className="w-4 h-4" />
          {language === "en"
            ? `Showing ${startIndex} to ${endIndex} of ${totalItems} videos`
            : `${totalItems} টি ভিডিওর মধ্যে ${startIndex} থেকে ${endIndex} দেখানো হচ্ছে`}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Grid className="w-4 h-4 text-muted-foreground" />
          <label
            htmlFor="rows"
            className="text-sm font-medium text-muted-foreground">
            {language === "en" ? "Show:" : "দেখান:"}
          </label>
          <select
            id="rows"
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="h-9 px-3 rounded-lg border bg-background text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200">
            {[6, 9, 12, 18, 24].map((n) => (
              <option
                key={n}
                value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
});
