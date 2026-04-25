# Tovy - Project Blueprint

## 1. Project Overview

**Tovy** is a modern, professional website designed to showcase AI development services. Its primary goal is to attract potential clients by highlighting the company's expertise, philosophy, and successful projects. The site features a clean, dark-themed design with subtle animations and a clear call-to-action, guiding users to a 7-step strategic project intake form.

## 2. Core Features

- **Landing Page**: A full-screen, cinematic single-page experience:
  - **Hero Section**: High-impact introduction with dual CTAs.
  - **Pain vs. Solution**: Highlights the contrast between chaos and Tovy's centralized approach.
  - **About Section**: Details core values: Technology, Optimization, Freedom, Innovation.
  - **Engineering Section**: Showcases the Tovy methodology and service lines.
  - **Testimonials**: Social proof via a glassmorphism marquee.
- **Project Intake Form**: A 7-step strategic lead qualification engine:
  - **Validation**: Professional email domain enforcement.
  - **Scoring**: Weighted algorithm for Company Size, Budget, and Urgency.
  - **Routing**: Path A/B (Booking) vs Path C (Self-service).
- **KX Hub**: A bilingual (EN/NL) professional resource center for technical insights.
- **Journey Mapping**: Integrated `visitor_id` and `trace_id` tracking across Firestore and GTM.

## 3. Tech Stack

- **Architecture**: Next.js 15 (App Router) + Static Export (SSG).
- **Styling**: Tailwind CSS, ShadCN UI, Framer Motion.
- **Database**: Firebase Firestore (Client-side integration).
- **Analytics**: Google Tag Manager + custom type-safe Data Layer.

## 4. Key File Structure

- `src/app/`: Core routing and pre-rendered pages.
- `src/content/`: Markdown-based localized KX Hub articles.
- `src/lib/definitions.ts`: Zod schemas for form validation and routing.
- `src/components/landing/project-intake-form.tsx`: The qualification logic and UI.
- `firebase.json`: CDN and edge caching configuration.
