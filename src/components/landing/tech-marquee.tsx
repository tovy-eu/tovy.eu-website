import React from "react";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";

// Locale-independent product names, so no per-language content is needed here.
const STACK = [
  "dbt",
  "Databricks",
  "Microsoft Azure",
  "Google Cloud",
  "AWS",
  "Python",
  "SQL",
  "TypeScript",
  "Power BI",
  "SAP",
  "Oracle",
];

export function TechMarquee({ dict }: { dict: Dictionary }) {
  // Tripled for a long, seamless loop; clones are hidden from assistive tech
  const rows = [STACK, STACK, STACK];

  return (
    <section className="w-full py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 mb-10 md:mb-14">
        <SectionHeader
          badge={dict.global.common.techStack}
          title={dict.pages.home.marquee.title}
          description={dict.pages.home.marquee.subtitle}
        />
      </div>
      <div
        className="relative flex items-center"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              aria-hidden={rowIndex > 0 ? "true" : undefined}
              className="flex items-center"
            >
              {row.map((name) => (
                <React.Fragment key={name}>
                  <span className="font-mono text-sm md:text-base tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300 cursor-default px-6 md:px-10">
                    {name}
                  </span>
                  <span
                    className="text-primary/40 text-[8px] select-none"
                    aria-hidden="true"
                  >
                    ◆
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
