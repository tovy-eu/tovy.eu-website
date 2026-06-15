"use client";

import { useEffect } from "react";
import { setPageCategory } from "@/lib/tracking";

interface PageCategorySetterProps {
  category: string;
}

export function PageCategorySetter({ category }: PageCategorySetterProps) {
  useEffect(() => {
    setPageCategory(category);
  }, [category]);

  return null;
}
