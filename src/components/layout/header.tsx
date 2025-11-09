
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#project-form", label: "Contact" },
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
      <div className="container flex h-16 max-w-6xl items-center justify-center px-4 md:px-8">
        <div className="flex items-center gap-x-8">
          <Link href="/" className="font-bold text-lg text-primary transition-transform hover:scale-105">
            Tovy AI
          </Link>
          <nav className="hidden md:flex items-center justify-center">
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
          <Button asChild>
            <Link href="#project-form">Start Project</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
