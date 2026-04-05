# Tovy - Project Blueprint

## 1. Project Overview

**Tovy** is a modern, professional website designed to showcase AI development services. Its primary goal is to attract potential clients by highlighting the company's expertise, philosophy, and successful projects. The site features a clean, dark-themed design with subtle animations and a clear call-to-action, guiding users to a multi-step project intake form. It also includes a KX Hub (Knowledge Exchange) to share insights and establish thought leadership.

## 2. Core Features

The application is built around the following key features:

- **Landing Page**: A comprehensive single-page experience composed of:
  - **Hero Section**: An impactful introduction with a strong headline and dual CTAs ("Work with us" and "Explore KX Hub").
  - **About Section**: Details the company's core values (Technology, Optimization, Freedom, Innovation).
  - **Solutions Showcase**: A carousel to display case studies or past projects.
  - **Tech Marquee**: A scrolling display of industry-standard technologies Tovy works with.
- **Project Intake Form**: A multi-step, user-friendly form at `/project-request` to capture detailed client requirements. It asks sequential questions to qualify leads effectively.
- **KX Hub**: A professional resource center at `/kx` for publishing technical insights and documentation. It includes a bento-grid listing page and individual resource pages.
- **Reading Progress**: A horizontal progress bar on KX resource pages to help users gauge their progress.

## 3. Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod for validation
- **Blog Content**: Markdown files stored in the repository.
- **Database**: Firebase Firestore

## 4. Key File Structure

Here are the most important files and directories in the project:

- `src/app/`: Contains the core application routing and pages.
  - `page.tsx`: The main landing page.
  - `kx/`: The Knowledge Exchange listing and individual resource pages.
  - `project-request/`: The page for the project intake form.
  - `layout.tsx`: The root layout for the entire application.
  - `globals.css`: Global styles and Tailwind CSS theme configuration.
- `src/components/`: Reusable React components.
  - `landing/`: Components specific to the main landing page.
  - `layout/`: Components for the overall page structure.
  - `ui/`: ShadCN UI components.
- `src/lib/`: Utility functions, type definitions, and business logic.
  - `blog.ts`: Functions for reading and parsing markdown KX resources.
  - `definitions.ts`: Zod schema and type definitions.
- `src/content/kx/`: The directory where markdown files for resources are stored.
- `tailwind.config.ts`: Configuration file for Tailwind CSS.
- `blueprint.md`: This file, serving as the project's high-level documentation.
