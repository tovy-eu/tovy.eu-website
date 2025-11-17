# Tovy AI - Project Blueprint

## 1. Project Overview

**Tovy** is a modern, professional website designed to showcase AI development services. Its primary goal is to attract potential clients by highlighting the company's expertise, philosophy, and successful projects. The site features a clean, dark-themed design with subtle animations and a clear call-to-action, guiding users to a multi-step project intake form. It also includes a blog to share insights and establish thought leadership.

## 2. Core Features

The application is built around the following key features:

- **Landing Page**: A comprehensive single-page experience composed of:
  - **Hero Section**: An impactful introduction with a strong headline and dual CTAs ("Work with us" and "Read about us").
  - **About Section**: Details the company's core values (Technology, Optimization, Freedom, Innovation).
  - **Solutions Showcase**: A carousel to display case studies or past projects.
- **Project Intake Form**: A multi-step, user-friendly form at `/project-request` to capture detailed client requirements. It asks sequential questions to qualify leads effectively.
- **Blog**: A markdown-based blog accessible at `/blog` for publishing articles. It includes a main listing page and individual post pages.
- **Subscription Form**: A component to capture user emails for a newsletter, integrated into the blog.
- **CMS for Content**: The `/admin` route is set up with Decap CMS to allow for easy management of blog content.

## 3. Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod for validation
- **Content Management**: Decap CMS (for the blog)

## 4. Key File Structure

Here are the most important files and directories in the project:

- `src/app/`: Contains the core application routing and pages.
  - `page.tsx`: The main landing page.
  - `blog/`: The blog list and individual post pages.
  - `project-request/`: The page for the project intake form.
  - `layout.tsx`: The root layout for the entire application.
  - `globals.css`: Global styles and Tailwind CSS theme configuration.
- `src/components/`: Reusable React components.
  - `landing/`: Components specific to the main landing page (e.g., `HeroSection`, `AboutSection`).
  - `layout/`: Components for the overall page structure (e.g., `Header`, `Footer`).
  - `ui/`: ShadCN UI components.
- `src/lib/`: Utility functions, type definitions, and business logic.
  - `blog.ts`: Functions for reading and parsing markdown blog posts.
  - `definitions.ts`: Zod schema and type definitions for the project intake form.
- `content/blog/`: The directory where markdown files for blog posts are stored.
- `tailwind.config.ts`: Configuration file for Tailwind CSS, including theme colors and typography styles.
- `blueprint.md`: This file, serving as the project's high-level documentation.
