import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-8 max-w-6xl px-4 md:px-8">
        <div className="flex flex-col items-center md:items-start gap-4 text-center md:text-left">
          <p className="text-sm leading-loose text-muted-foreground">
            © {new Date().getFullYear()} Tovy AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="mailto:info@tovy.eu" className="text-sm text-muted-foreground hover:text-primary">
              info@tovy.eu
            </Link>
          </div>
        </div>
        
        <div className="flex items-center justify-center md:justify-end gap-1">
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
      </div>
    </footer>
  );
}
