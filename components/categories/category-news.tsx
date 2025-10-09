"use client";
import { useApi } from "@/hooks/useApi";
import { Category } from "@/lib/content-models";

import React, { useEffect, useState } from "react";
import SingleCategory from "./single-category";

function CategoryNews() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { data: categoriesData, refetch: categoryRef } = useApi<Category[]>(
    ["categoriesData"],
    "/categories"
  );
  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData.reverse().slice(0, 6));
    }
  }, [categoriesData, categoryRef]);
  return (
    <section className="mt-6">
      {categories.map((item, i) => (
        <div key={i}>
          <SingleCategory slug={item.slug} />
        </div>
      ))}
    </section>
  );
}

export default CategoryNews;
