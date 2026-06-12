# Tovy - Project Blueprint

## 1. Project Overview

**Tovy** is a modern, professional website designed to showcase AI development services. Its primary goal is to attract potential clients by highlighting the company's expertise, philosophy, and successful projects. The site features a clean, dark-themed, cinematic single-page design with subtle animations and a clear call-to-action, guiding users to a 7-step strategic project intake form. It also includes the localized "KX Hub" for technical insights and thought leadership.

---

## 2. Core Features

### 2.1 Landing Page
A full-screen, cinematic single-page experience composed of:
- **Hero Section**: An impactful, modern introduction with a strong headline, subtext, and dual CTAs ("Work with us" / "Start Project" and "Read about us") emphasizing speed, control, and peace of mind.
- **Pain vs. Solution Section**: Highlights the contrast between chaos (traditional approaches) and calm clarity (Tovy's centralized approach). Focuses on *"AI should simplify, not complicate."*
- **About Section**: Details the company's core values and brand pillars: Technology, Optimization, Freedom, and Innovation to anchor the user emotionally.
- **Engineering Section**: Showcases the Tovy methodology, service lines, and technical capabilities.
- **Testimonials Section**: Social proof via a glassmorphism marquee establishing trust, credibility, and peace of mind.
- **FAQ Section**: Structured accordion of common questions designed to address potential objections.

### 2.2 7-Step Strategic Project Intake Form (`/project-request`)
A highly optimized, sequential lead-qualification engine:
- **Structure**: Multi-step, user-friendly form asking targeted questions to qualify leads effectively.
- **Validation**: Strict professional email domain enforcement.
- **Scoring**: Weighted scoring algorithm based on Company Size, Budget readiness, Urgency, and Timeline.
- **Routing**: Smart routing separating Path A/B (prompt booking) from Path C (self-service resource delivery).
- **Form Data Storage**: Form responses are stored in a Firebase Firestore collection named `project_requests` with fields for maturity, company size, engineering team size, project focus, challenges, vision, budget readiness, timeline readiness, and contact info.
- **Lead Qualification (AI Integration)**: An automated Google Cloud / Firebase function evaluates and tags incoming leads (e.g., "High-fit", "Medium-fit", "Low-fit") and generates a concise, one-sentence project challenge and vision summary for rapid developer/engineer triage.

### 2.3 KX Hub (Knowledge Exchange)
A localized (EN/NL/DE/ES) professional resource center for technical insights and AI-engineering thought leadership.
- Includes a listing page and localized markdown-based article pages (stored in `/src/content/kx/`).
- Integrates a **Subscription Form** to capture user emails for insights newsletter delivery.

### 2.4 Journey Mapping & Analytics
- Track funnel progression: Started Form, Completed Step 3, Submitted Project Request.
- Integration of Google Tag Manager (GTM) + custom type-safe Data Layer.
- Journey Mapping: Preserves and correlates `visitor_id` and `trace_id` tracking across client-side forms, GTM, and Firestore document records.

---

## 3. Style Guidelines & Aesthetics

- **Atmosphere**: Calm, focused, and professional. Visuals should evoke reliability and control, feeling like a trusted, premium engineering dashboard rather than a typical high-conversion SaaS landing page.
- **Colors**:
  - Dark-theme background: Deep, focused slate-blue (`#0C0F12` / `#0a1120`).
  - Brand Gradients: Soft blue-green/teal flow (`#00B4D8` → `#3BE2B0`) to represent innovation, speed, and intelligence.
  - Text: Clean high-contrast neutral-gray (`#E5E5E5`) for maximum readability on dark background grids.
- **Typography**: `Inter` (Google Font) or Geist for clean, modern sans-serif aesthetics.
- **Interactions**: Grid-based layouts with generous spacing, subtle fluid transitions, hover effects, and scroll-reveals.

---

## 4. Tech Stack

- **Framework**: Next.js 15 (App Router) + Static Export (SSG/HTML).
- **Language**: TypeScript (Strict typing and schemas).
- **Styling**: Tailwind CSS, Framer Motion, CSS custom properties.
- **Database & Platform**: Firebase Firestore (client-side data storage) + Firebase Hosting.
- **State & Form Validation**: React Hook Form combined with Zod schemas.
- **Analytics**: Google Tag Manager (custom event mappings) & Firebase Analytics.

---

## 5. Key File Structure

```text
/
├── .eslintrc.json                          <-- [Legacy - to be cleaned up]
├── eslint.config.mjs                       <-- ESLint flat config (source of truth)
├── firestore.rules                         <-- Firestore security rules & permissions
├── firestore.indexes.json                  <-- Firestore collection query indexes
├── package.json                            <-- Root package configuration & commands
├── next.config.ts                          <-- Root Next.js configuration (active)
├── blueprint.md                            <-- This file (Unified Project Master Blueprint)
├── functions/                              <-- Firebase Cloud Functions
│   ├── src/index.ts                        <-- Cloud function handlers (e.g., lead scoring, AI tagging)
│   ├── tsconfig.json                       <-- Functions TypeScript config
│   └── package.json                        <-- Functions dependencies & scripts
├── public/                                 <-- Static public assets (images, webp logos, etc.)
└── src/
    ├── app/                                <-- Pages and layout routes
    │   ├── page.tsx                        <-- Entry redirection / language detection
    │   ├── [lang]/                         <-- Localized sub-folders (en, nl, es, de)
    │   │   ├── page.tsx                    <-- Home (Landing Page)
    │   │   ├── kx/                         <-- Localized KX Hub (insights)
    │   │   ├── project-request/            <-- Intake form page
    │   │   ├── privacy-policy/             <-- Compliance documents
    │   │   └── legal-notice/               <-- Publisher identification page
    │   └── globals.css                     <-- Styling & theme configuration
    ├── components/                         <-- Modular UI & layout components
    │   ├── landing/                        <-- Hero, Pain/Solution, Engineering, Intake Form
    │   ├── layout/                         <-- Header, Footer, Analytics, Language Switcher
    │   └── ui/                             <-- Reusable layout primitives (Accordion, Card, Input)
    ├── content/                            <-- Localized content definitions for KX hub
    ├── dictionaries/                       <-- Translation dictionaries (en.json, nl.json, etc.)
    └── lib/                                <-- Shared configurations and library drivers
        ├── config.ts                       <-- Central app feature flags & i18n configs
        ├── definitions.ts                  <-- Form step Zod schemas & routing logic
        └── firebase.ts                     <-- Firebase client initialization & DB drivers
```
