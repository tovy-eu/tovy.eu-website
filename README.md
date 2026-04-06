# Tovy - Smart Data Ecosystems & AI Foundations

Tovy is a high-end, professional platform designed to showcase advanced AI and data engineering services. Built with a focus on **Machine Experience (MX) Design**, Tovy transforms fragmented data silos into unified, automated foundations that scale with business growth.

## 🚀 Overview

Tovy serves as both a strategic consultancy showcase and a technical resource center. The platform features a sophisticated dark-themed aesthetic with high-performance animations, localized content (EN/NL), and a proprietary lead qualification engine.

## ✨ Key Features

- **Strategic Landing Page**: A conversion-optimized experience highlighting Tovy's methodology and core values (Technology, Optimization, Freedom, Innovation).
- **Knowledge Exchange (KX) Hub**: A professional resource center for technical insights and engineering documentation, featuring a reading progress indicator and bento-grid layout.
- **Advanced Project Intake Form**: A multi-step strategic form that qualifies leads in real-time using a weighted scoring algorithm:
  - **Path A/B**: High-intent leads are routed to an integrated Calendly booking system.
  - **Path C**: Exploratory leads are directed to the KX Hub for self-service learning.
- **Machine Experience (MX)**: Extensive JSON-LD structured data (Schema.org) to optimize for AI-driven search and prompt discovery.
- **Bilingual Architecture**: Full i18n support for English and Dutch with seamless language switching.
- **Privacy & Compliance**: GDPR-compliant cookie consent management and detailed legal documentation.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database & Hosting**: [Firebase (Firestore & Hosting)](https://firebase.google.com/)
- **Analytics**: [Google Tag Manager (GTM)](https://tagmanager.google.com/)

## 📁 Project Structure

```text
src/
├── app/              # Next.js App Router (Localized segments)
├── components/       # UI Library (Landing, Layout, KX, etc.)
├── content/          # Markdown (KX Resources) and Company Metadata
├── dictionaries/     # i18n Translation Files (EN/NL)
├── hooks/            # Custom React Hooks
├── lib/              # Utilities, Definitions, and Firebase Config
└── ai/               # Genkit AI Flows (if applicable)
```

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- npm / yarn / pnpm
- Firebase Project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/tovy-eu/tovy-platform.git
   cd tovy-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.local` file with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🚀 Deployment

The project is optimized for **Static Site Generation (SSG)** and can be deployed to Firebase Hosting:

```bash
npm run build
firebase deploy
```

## ⚖️ License

All rights reserved. © 2026 Tovy.

    