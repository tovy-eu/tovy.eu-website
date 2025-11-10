"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background"
      )}
    >
      <div className="flex h-16 w-full items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href="/" className="font-bold text-lg">
          <span>TOV</span>
          <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">Y</span>
        </Link>

        {/* Right: CTA Button */}
        <Button asChild>
          <Link href="/project-request">Start Project</Link>
        </Button>
      </div>
    </header>
  );
}
