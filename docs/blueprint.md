# **App Name**: Tovy

## Core Features:

- Hero Section: Showcase headline, subtext, and CTA (“Start Project”) emphasizing speed, control, and peace of mind. Example: “Your AI development partner — we build clean, fast, and reliable systems that give you full control.”
- Pain vs. Solution Section: Highlight the contrast between chaos (traditional approach) and calm clarity (Tovy’s approach). Focus on *“AI should simplify, not complicate.”*
- About Section: Introduce Tovy’s philosophy and brand pillars — Technology, Optimization, Freedom, and Innovation — to anchor the user emotionally. Example: “We build systems that let people and technology work in harmony.”
- Testimonials Section: Include a few testimonial cards or quotes to establish trust and credibility, reinforcing peace of mind through proof.
- Project Intake Form: Sequential, one-question-per-page lead qualification form modeled after Datalumina’s structure.
- Form Data Storage: Store all form responses in a Firestore collection named `project_requests` with fields for maturity, company size, engineering team, project focus, challenges, vision, budget readiness, timeline readiness, and contact info.
- Lead Qualification Tool (AI Integration): Use generative AI as a tool to evaluate and tag leads based on form responses (e.g., “High-fit / Medium-fit / Low-fit”) and summarize the project challenge and vision in one sentence for quick triage by engineers.
- Analytics and Conversion Tracking: Connect Firebase Analytics to track funnel progression: Started Form, Completed Step 3, Submitted Project Request

## Style Guidelines:

- #0C0F12 for a calm, focused atmosphere.
- Soft blue-green gradient (`#00B4D8 → #3BE2B0`) to represent innovation and flow.
- #E5E5E5 for readability on dark backgrounds.
- ‘Inter’ (Google Font) for clean, modern, readable design.
- Grid-based structure with generous spacing and clear hierarchy.
- Subtle, fluid transitions (e.g., form step change, button hover, scroll reveal).
- Visuals should evoke reliability, control, and calm — like a trusted engineering dashboard, not a marketing page.