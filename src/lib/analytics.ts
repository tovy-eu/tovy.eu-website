/**
 * @fileOverview Type-safe Data Layer utility for Tovy.
 * Routes all events to Google Tag Manager via the window.dataLayer.
 * Now includes Visitor ID and Trace ID for journey mapping.
 */

type AnalyticsEvent =
  | { name: 'cta_click'; event_category: string; event_label: string }
  | { name: 'read_blog_click'; event_category: string; event_label: string }
  | { name: 'logo_home_refresh'; event_category: string; event_label: string; is_refresh: boolean }
  | { name: 'logo_home_return'; event_category: string; event_label: string; from_path: string }
  | { name: 'project_request_started'; event_category: string; event_label: string; value: string }
  | { name: 'project_request_step_complete'; event_category: string; step_number: number; step_name: string }
  | { name: 'completed_step_three'; event_category: string; event_label: string }
  | { name: 'project_request_success'; event_category: string; event_label: string }
  | { name: 'book_meeting_click'; event_category: string; event_label: string }
  | { name: 'language_switched'; event_category: string; event_label: string; target_language: string; source_language: string; is_language_switch: boolean }
  | { name: 'json_download'; event_category: string; event_label: string }
  | { name: 'social_link_click'; event_category: string; event_label: string }
  | { name: 'blog_post_view'; event_category: string; event_label: string; blog_slug: string; blog_title: string }
  | { name: 'cookie_consent_decision'; event_category: string; event_label: string; decision: 'accept' | 'decline' };

/**
 * Generates a random unique identifier.
 */
const generateId = (length: number = 16): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Retrieves or creates a persistent Visitor ID.
 */
export const getVisitorId = (): string => {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('tovy_visitor_id');
  if (!id) {
    id = generateId();
    localStorage.setItem('tovy_visitor_id', id);
  }
  return id;
};

/**
 * Retrieves or creates a session-based Trace ID.
 */
export const getTraceId = (): string => {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('tovy_trace_id');
  if (!id) {
    id = generateId();
    sessionStorage.setItem('tovy_trace_id', id);
  }
  return id;
};

/**
 * Pushes a custom event to the GTM Data Layer.
 * Automatically injects visitor_id and trace_id for sequence analysis.
 * @param event The event object conforming to the AnalyticsEvent schema.
 */
export const trackEvent = (event: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    const { name, ...params } = event;
    
    window.dataLayer.push({
      event: name,
      visitor_id: getVisitorId(),
      trace_id: getTraceId(),
      ...params
    });
  }
};
