"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // This ensures the year is set on the client after hydration,
    // avoiding a server-client mismatch.
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="container mx-auto flex flex-col items-center gap-6 py-8 max-w-6xl px-4 md:px-8">
        
        {/* Social Icons */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="#" target="_blank">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="#" target="_blank">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </Button>
        </div>
        
        {/* Center: Links */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/privacy-policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <div className="h-4 w-px bg-border"></div>
          <Link href="mailto:info@tovy.eu" className="hover:text-primary transition-colors">
            info@tovy.eu
          </Link>
        </div>
        
        {/* Bottom: Copyright */}
        <div className="text-sm text-muted-foreground">
          © {year} Tovy AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
