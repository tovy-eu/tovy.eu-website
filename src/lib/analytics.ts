/**
 * @fileOverview Type-safe Google Analytics utility for Tovy.
 * Enforces a strict schema for all tracking events to ensure data consistency.
 */

type AnalyticsEvent =
  | { name: 'newsletter_signup'; event_category: string; event_label: string }
  | { name: 'cta_click'; event_category: string; event_label: string }
  | { name: 'read_blog_click'; event_category: string; event_label: string }
  | { name: 'logo_home_refresh'; event_category: string; event_label: string; is_refresh: boolean }
  | { name: 'logo_home_return'; event_category: string; event_label: string; from_path: string }
  | { name: 'project_request_started'; event_category: string; event_label: string; value: string }
  | { name: 'project_request_step_complete'; event_category: string; step_number: number; step_name: string }
  | { name: 'completed_step_three'; event_category: string; event_label: string }
  | { name: 'project_request_success'; event_category: string; event_label: string }
  | { name: 'language_switched'; event_category: string; event_label: string; target_language: string; source_language: string; is_language_switch: boolean }
  | { name: 'json_download'; event_category: string; event_label: string }
  | { name: 'social_link_click'; event_category: string; event_label: string }
  | { name: 'blog_post_view'; event_category: string; event_label: string; blog_slug: string; blog_title: string }
  | { name: 'cookie_consent_decision'; event_category: string; event_label: string; decision: 'accept' | 'decline' }
  | { name: 'web_vitals'; event_category: 'performance'; event_label: string; value: number; metric_id: string; non_interaction: boolean };

/**
 * Tracks a custom event in Google Analytics.
 * @param event The event object conforming to the AnalyticsEvent schema.
 */
export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const { name, ...params } = event;
    window.gtag('event', name, params);
  }
};
