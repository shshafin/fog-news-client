"use client";

interface CategoryHeaderProps {
  title: string;
}

export function CategoryHeader({ title }: CategoryHeaderProps) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-1 h-8 bg-gradient-to-b from-red-600 to-red-500 rounded-full"></div>
        <h1 className="text-3xl font-bold text-foreground">
          {title || "General"}
        </h1>
      </div>
      <div className="h-px bg-gradient-to-r from-red-600 via-red-300 to-transparent w-full"></div>
    </section>
  );
}
