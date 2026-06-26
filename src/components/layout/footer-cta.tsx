"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { sendGA4Event } from "@/lib/tracking";

export function FooterCTA({ href, text, children }: { href: string; text: string; children: ReactNode }) {
  return (
    <Link href={href} onClick={() => sendGA4Event("cta_clicked", { location: "footer", text })}>
      {children}
    </Link>
  );
}
