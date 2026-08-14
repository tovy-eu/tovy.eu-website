// Storage key holding the real external referrer, stashed by the language-redirect shim
// pages (src/app/page.tsx etc.) before their client-side location.replace(). Without this,
// the destination /[lang]/ page sees our own domain as document.referrer -> GA4 treats it
// as a self-referral and drops the source, so social/organic traffic collapses to "(direct)".
export const ENTRY_REFERRER_KEY = "tovy_entry_referrer";

/**
 * Pick the referrer GA should attribute a session to. Prefers a stashed external referrer
 * (the true entry source, first-touch) over the current document referrer, which after the
 * redirect hop is usually our own domain. A stashed value pointing at our own host is not a
 * real source, so it's ignored in favour of the current value.
 */
export function resolvePageReferrer(
  stashed: string | null | undefined,
  current: string,
  hostname: string,
): string {
  if (stashed && !stashed.includes(hostname)) return stashed;
  return current || "";
}
