# Tovy - Smart Data Ecosystems & AI Foundations

Tovy is a high-end, professional platform designed to showcase advanced AI and data engineering services. Built with a focus on **Machine Experience (MX) Design**, Tovy transforms fragmented data silos into unified, automated foundations.

🌐 **[TOVY Live Platform](https://www.tovy.eu/?utm_source=github&utm_medium=profile&utm_campaign=readme_link)**

---

## 📖 Deep Technical & Business Architecture

For an exhaustive technical mapping, file-by-file directory responsibilities, and step-by-step tracing of business workflows (such as lead progress auto-saving, lead scoring, email notification triggers, and cron-scheduled abandonment recovery), see the master blueprint:
👉 **[RECON_LOG.md](./RECON_LOG.md)**

---

## 🚀 Technical Architecture

Tovy is architected as a serverless **Static Site Generation (SSG)** application, optimized for high-speed delivery at the **Edge**.

### 1. Build-Time (Static Generation)
- **Framework**: Next.js 15 (App Router) configured for fully static exports (`output: 'export'`).
- **i18n**: Pre-renders four fully static locales (`en`, `nl`, `es`, `de`) into isolated, SEO-friendly route segments.
- **Deduplicated Early Language Routing**: Client-side locale redirection is handled immediately at the root via an inline, zero-flicker redirection script utilizing cookie checks and `navigator.language` split-matching.

### 2. The Edge (Global Delivery)
- **Hosting**: Firebase Hosting (CDN).
- **Performance**: Static assets served from global Points of Presence (PoPs) with immutable cache headers for sub-100ms response times.
- **SEO & AI Discoverability**: Raw static HTML provides 100% indexability for standard search engines as well as LLM-driven AI indexing agents.

### 3. The Client & Database (JAMstack Integration)
- **Direct-to-Cloud Integration**: Clients communicate directly with **Google Cloud Firestore** via the Firebase Client SDK. This eliminates custom backend layers, drastically decreasing latency and operational overhead.
- **Input Security & Constraints**: Database write operations are secured on the network boundary via strict `firestore.rules` (which block client-side reads entirely and enforce email validation rules to prevent email-relay abuse).
- **Lead Journey Preservation**: Tracks and synchronizes an end-to-end user-journey tunnel using persistent `visitor_id` and unique `trace_id` mappings across both client-side forms and Google Analytics 4 (GA4).

---

## ✨ Key Features & Business Workflows

- **Strategic Lead Qualification**: A 7-step Intake Form with professional domain checks, real-time client-profile scoring, and prompt routing (Path A for high-fit leads vs Path B).
- **Automated Lead Recovery**: A scheduled Firebase Cloud Function (`checkAbandonmentEmails`) triggers a cron check every 15 minutes to recover incomplete, abandoned form entries older than 2 hours—queuing a localized, high-performance reminder email.
- **Real-Time Admin Alerting**: Document-creation event listeners in Firebase Functions intercept new lead filings and queue notifications to the admin team via `ntfy.sh`.
- **Machine Experience (MX) Schema Injection**: Automated JSON-LD structured data (Organization, Services, FAQPage, BreadcrumbList) for AI search engine optimization.
- **GDPR Privacy & Cookie Consent**: Lightweight, client-side compliance banner that broadcasts cookie-consent status changes to dynamically activate/deactivate tracking listeners.
- **Knowledge Exchange (KX) Hub (Feature-Flagged)**: An integrated technical blog resource structure is fully supported inside configurations and dictionaries, but is currently deactivated via `CONFIG.enableBlog: false` in `src/lib/config.ts`.

---

## 🛠 Tech Stack

- **Web Framework:** [Next.js 15 (React 19)](https://nextjs.org/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/)
- **Animations:** [Framer Motion v12](https://www.framer.com/motion/)
- **State Validation:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Database / Host:** [Google Firebase (Hosting, Firestore, Functions, Extensions)](https://firebase.google.com/)
- **Analytics:** [Google Tag Manager & GA4](https://tagmanager.google.com/)

---

## 🚦 Getting Started

### 1. Installation & Local Development
Install dependencies and run the Next.js development server:
```bash
npm install
npm run dev
```

### 2. Code Quality Gates
Run strict TypeScript compilation typechecks and ESLint style checks before committing code:
```bash
npm run typecheck    # Run tsc compiler
npm run lint         # Run ESLint linter
```

### 3. Deployment
Deploy changes directly to Firebase Hosting and Cloud Functions:
```bash
npm run deploy       # Full build, verification, and Firebase deploy (via scripts/deploy.sh)
```

---

## 🔄 CI/CD Pipeline

Tovy utilizes an automated GitHub Actions workflow for zero-downtime deployments:
*   **Workload Identity Federation (WIF):** Secure, keyless authentication to Google Cloud.
*   **Quality Gates:** Pull requests trigger automatic typechecks and ESLint checks.
*   **Preview Environments:** Temporary, 7-day Firebase Hosting Preview Channels are automatically generated on every Pull Request for stakeholder review before code merges.
*   **Production Deployment:** Merging to the `main` branch automatically triggers static HTML building and deploys the static `/out` bundle to live Firebase Hosting.

---

## ⚖️ License

All rights reserved. © 2026 Tovy.
