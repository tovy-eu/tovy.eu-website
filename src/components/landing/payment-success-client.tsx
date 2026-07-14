"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WavyLines } from "@/components/landing/wavy-lines";
import type { Dictionary } from "@/lib/get-dictionary";

interface PaymentSuccessClientProps {
  dict: Dictionary;
  email: string;
  lang: string;
}

export default function PaymentSuccessClient({ dict, email, lang }: PaymentSuccessClientProps) {
  const content = dict.pages.paymentSuccess.content;

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
      style={{
        background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(16, 185, 129, 0.15), hsla(0, 0%, 100%, 0))",
      }}
    >
      {/* Hide header and footer on this page */}
      <style dangerouslySetInnerHTML={{ __html: "header, footer { display: none !important; }" }} />
      <WavyLines />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="z-10 w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-card/30 p-8 text-center backdrop-blur-xl shadow-2xl md:p-12"
      >
        {/* Animated Checkmark Icon */}
        <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
          {/* Animated background pulse/glow rings */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.15, opacity: [0, 0.15, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-emerald-500/30"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.3, opacity: [0, 0.08, 0] }}
            transition={{
              duration: 2,
              delay: 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-emerald-500/20"
          />
          
          {/* Main Circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/20"
          >
            {/* SVG Path drawing checkmark */}
            <svg
              className="h-10 w-10 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                  delay: 0.4,
                }}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>
        </div>

        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400"
        >
          {content.badge}
        </motion.span>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
        >
          {content.title}
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mx-auto my-6 h-px w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mx-auto max-w-md text-base leading-relaxed text-muted-foreground"
        >
          {content.subtitle}
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10"
        >
          <Button asChild size="lg" className="w-full sm:w-auto px-10">
            <Link href={`/${lang}/`}>{content.returnHome}</Link>
          </Button>
        </motion.div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-12 border-t border-white/5 pt-6 text-xs text-muted-foreground"
        >
          <p>
            {content.needHelp}{" "}
            <a
              href={`mailto:${email}`}
              className="text-white underline transition-colors hover:text-emerald-400"
            >
              {email}
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
