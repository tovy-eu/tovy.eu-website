import { i18n } from './config';
import { ENTRY_REFERRER_KEY } from './referrer';

/**
 * Builds the inline language-detect-and-redirect script used by the static root stub pages
 * (/, /project-request, /payment-success). Kept as an inline <script> (not a client module)
 * because these pages are statically exported and must redirect before any bundle loads.
 *
 * @param suffix path segment after the locale, e.g. '' or 'project-request/'
 * @param stashReferrer stash the external referrer before redirecting so the destination
 *   /[lang]/ page doesn't see our own domain as a self-referral. Skip on no-index pages.
 */
export function buildRedirectScript(suffix: string, stashReferrer = true): string {
  const supported = JSON.stringify(i18n.locales);
  const def = i18n.defaultLocale;
  const stash = stashReferrer
    ? `if (!sessionStorage.getItem('${ENTRY_REFERRER_KEY}') && document.referrer) {
                  sessionStorage.setItem('${ENTRY_REFERRER_KEY}', document.referrer);
                }`
    : '';

  return `
            (function() {
              try {
                ${stash}
                var target = '${def}';
                var supported = ${supported};
                var cookieLang = (document.cookie.match(/^(?:.*;)?NEXT_LOCALE=([^;]+)(?:.*)?$/) || [, ''])[1];

                if (cookieLang && supported.includes(cookieLang)) {
                  target = cookieLang;
                } else {
                  var browserLang = navigator.language.split('-')[0];
                  if (supported.includes(browserLang)) {
                    target = browserLang;
                  }
                  document.cookie = 'NEXT_LOCALE=' + target + '; Path=/; Max-Age=' + (365 * 24 * 60 * 60) + '; Secure; SameSite=Lax';
                }
                var search = window.location.search || '';
                window.location.replace('/' + target + '/${suffix}' + search);
              } catch (e) {
                window.location.replace('/${def}/${suffix}' + (window.location.search || ''));
              }
            })();
          `;
}
