"use client";

import { useEffect } from "react";

/**
 * Syncs the <html lang> attribute with the locale resolved from the URL.
 * The root layout hard-codes lang="en"; this corrects it on the client for
 * every localized route. Renders nothing.
 */
export function LanguageSync({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
  }, [lang]);

  return null;
}
