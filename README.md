# Tovy - Smart Data Ecosystems & AI Foundations

Tovy is a high-end, professional platform designed to showcase advanced AI and data engineering services. Built with a focus on **Machine Experience (MX) Design**, Tovy transforms fragmented data silos into unified, automated foundations.
🌐 **[TOVY](https://www.tovy.eu/?utm_source=github&utm_medium=profile&utm_campaign=readme_link)**

## 🚀 Technical Architecture

Tovy is architected as a **Static Site Generation (SSG)** application, optimized for the **Edge**.

### 1. Build-Time (Static Generation)
- **Framework**: Next.js 15 (App Router) using `output: 'export'`.
- **KX Hub**: Markdown resources are parsed at build-time using `remark` and `gray-matter`, resulting in zero-latency documentation pages.
- **i18n**: Four locales (EN/NL/DE/ES) are pre-rendered into static route segments.

### 2. The Edge (Global Delivery)
- **Hosting**: Firebase Hosting (CDN).
- **Performance**: Assets are served from global PoPs with immutable caching headers for sub-100ms response times.
- **SEO**: Static HTML ensures 100% crawlability for search engines and AI agents (LLMs).

### 3. The Client (Real-time Logic)
- **Direct-to-Cloud**: Tovy interacts directly with **Firebase Firestore** via the Client SDK. This eliminates the need for a custom backend server, reducing latency and cost.
- **Lead Qualification**: A proprietary scoring algorithm runs in the browser to route prospects to **Path A/B** (Calendly) or **Path C** (KX Hub).
- **Journey Mapping**: Every visitor is assigned a persistent `visitor_id` and session-based `trace_id`. These are synchronized across Firestore and Google Tag Manager (GTM) for full-funnel attribution.

## ✨ Key Features

- **Strategic Lead Qualification**: A 7-step intake form with professional domain validation and automated routing logic.
- **Machine Experience (MX)**: Comprehensive JSON-LD structured data (Schema.org) for AI-driven discovery.
- **Knowledge Exchange (KX) Hub**: A high-performance resource center with reading progress indicators.
- **Privacy & Compliance**: GDPR-compliant consent management and detailed legal notice.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **UI**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Firebase Firestore](https://firebase.google.com/)
- **Analytics**: [Google Tag Manager](https://tagmanager.google.com/)

## 🚦 Getting Started

1. **Install**: `npm install`
2. **Configure**: Add Firebase credentials to `.env.local`
3. **Develop**: `npm run dev`
4. **Deploy**: `npm run build && firebase deploy`

## 🔄 CI/CD Pipeline

Tovy utilizes an advanced GitHub Actions workflow for zero-downtime, automated deployments:
- **Workload Identity Federation (WIF)**: Secure, keyless authentication to Google Cloud.
- **Quality Gates**: Strict `npm run typecheck` and ESLint checks run on every PR and push.
- **Preview Environments**: Every Pull Request automatically spins up a temporary, 7-day Firebase Preview Channel for stakeholder review before merging.
- **Production Deploy**: Merging to `main` instantly deploys the static build (`/out`) to live Firebase Hosting.

## ⚖️ License

All rights reserved. © 2026 Tovy.
