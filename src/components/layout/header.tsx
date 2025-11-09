"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#testimonials", label: "Testimonials" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-transparent"
      )}
    >
      <div className="container relative flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <div className="flex flex-1 items-center justify-start">
          <Link href="/" className="font-bold text-lg text-primary transition-transform hover:scale-105">
            Tovy AI
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 justify-center">
          <ul className="flex items-center space-x-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Button asChild variant="ghost">
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:flex flex-1 items-center justify-end">
          <Button asChild>
            <Link href="/project-request">Start Project</Link>
          </Button>
        </div>

        <div className="flex items-center justify-end md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-y-4 pt-8">
                <Link href="/" className="font-bold text-lg text-primary mb-4">
                  Tovy AI
                </Link>
                <ul className="flex flex-col items-start space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Button asChild variant="ghost">
                        <Link href={link.href}>{link.label}</Link>
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-4">
                  <Link href="/project-request">Start Project</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
