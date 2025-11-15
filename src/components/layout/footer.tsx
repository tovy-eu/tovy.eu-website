import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-12 max-w-6xl px-4 md:px-8">
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold text-lg">Stay Ahead of the Curve</h4>
          <p className="text-sm text-muted-foreground">
            Get expert insights on AI automation delivered to your inbox.
          </p>
          <form className="flex w-full max-w-sm items-center space-x-2">
            <Input type="email" placeholder="Email" className="rounded-md" />
            <Button type="submit" size="icon" className="rounded-md">
              <Send className="h-4 w-4" />
              <span className="sr-only">Subscribe</span>
            </Button>
          </form>
        </div>

        <div className="flex flex-col items-center gap-4 text-center md:text-left md:items-start">
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
