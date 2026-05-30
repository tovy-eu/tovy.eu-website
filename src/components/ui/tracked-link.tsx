"use client";

import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";
import { sendGA4Event } from "@/lib/tracking";

interface TrackedLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  eventName?: string;
  eventParams?: Record<string, unknown>;
}

export function TrackedLink({ children, className, eventName = "cta_clicked", eventParams = {}, ...props }: TrackedLinkProps) {
  const handleClick = () => {
    sendGA4Event(eventName, eventParams);
  };

  return (
    <Link {...props} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
