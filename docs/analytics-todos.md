# GA4 Analytics To-Dos

Captured 2026-08-13. Property that receives all data: **529319038** (stream `G-VL0FR2B3DH`). The site's tags `G-ESH71F3XK7` + `GT-5797Z722` both route here — always analyze property **529319038**, not the `G-ESH71F3XK7` property.

## Do now

- [x] ✅ **Data retention set to 14 months** (done 2026-08-14).
- [x] ✅ **Enable native Data redaction** (Admin → Data streams → stream → Redact data): auto-strip email + sensitive query params server-side *before storage*. Belt-and-suspenders over the client-side `sanitizeUrl` in `tracking.ts` — catches anything that slips past.
- [x] ✅ **Deploy** the User-ID code (uncommitted): `tracking.ts` (setUserId/clearUserId/setUserIdFromEmail + user_id in config/grantConsent), `cookie-banner.tsx` (clearUserId on decline), `project-intake-form.tsx` (email-hash user_id on submit).
- [x] ✅ **Collection works — the 503 was browser-local (an extension), not a real blocker.** Confirmed 2026-08-14: in a clean incognito window `region1.analytics.google.com/g/collect` returns **204 No Content** (hit accepted, `tid=G-VL0FR2B3DH`, `gcs=G111` consent granted, `ep.visitor_id` attached). The 503 only reproduces in browser profiles with a privacy/adblock extension hitting the EU `region1` endpoint — expected, nothing to fix (those users just don't get tracked). The near-empty property is **genuinely low traffic** (~8 sessions/28d), not dropped data. So downstream tasks are unblocked; they just have little data until traffic grows.
- [ ] **DebugView**: it stays empty unless hits carry a debug flag — use Tag Assistant "Connect" flow or GA Debugger extension to populate it.

## Once form events are actually landing

- [ ] Build a **Funnel exploration**: page_view → form_start → form_submission → generate_lead (shows drop-off in the multi-step intake form).
- [ ] Use **User explorer** to inspect individual leads (pairs with the User-ID setup; good fit for low-volume/high-value leads).
- [x] ✅ **Registered custom definitions** (done 2026-08-14): dimensions `routing_path`, `form_name`, `page_category`, `cta_name`; metric `lead_score`. Below kept for reference.
  - Dimensions (text, event-scope): `routing_path`, `form_name`, `page_category`, `cta_name`
  - Metric (number): `lead_score` (register as *metric* not dimension so it sums/averages). Same for `scroll_percent` if wanted.
  - **Never register** high-cardinality params — `visitor_id`, `trace_id`, `session_id`, `cta_text`, `link_url`, `error_message` — they trip the cardinality limit and collapse reports into an `(other)` row. Keep them on the payload for BigQuery/debug only. Cross-session stitching is already handled by `user_id`, not a dimension.
  - Verify each param actually arrives with a value (Realtime/DebugView) before spending a slot.
  - `(not set)` on UTMs = untagged (direct/organic) traffic, expected — do NOT "fix" by sending `""`. `undefined` param → `(not set)`; blank string → blank row that's harder to read.
  - Scope note: `lead_score`/`routing_path` are event-scoped (correct). "Avg score *per user*" would need a separate user-scoped dimension — scope can't be changed after creation.

## Audiences (create now so they accumulate; used for future remarketing, NOT day-to-day analysis)

Audiences aren't retroactive (max 30-day backfill, 24-48h to populate) — so create the money ones now, before Ads goes live, so they're populated when needed. For *analysis* (funnel/behavior) use **Segments** in Explore instead — retroactive + instant.

Build path: Admin → Data display → Audiences → New audience → Create custom audience (need **Marketer** role, not Editor). Set **membership duration to 540 (max)**, not the 30-day default — B2B consideration cycle is long, keep leads/abandoners in the remarketing pool. Note: no purchase/revenue events here, so the LTV / purchase-count / "min spend" recipes in Google's docs don't apply — `generate_lead` is the "purchase" equivalent.

- **Get conditions right the first time:** after saving, you can only edit an audience's **name/description/trigger** — conditions are locked. To change conditions you archive + recreate, and **archive is permanent** (no restore) + 48h before the name can be reused.
  - **Abandoners audience esp.:** an audience created *without* an Exclude filter can NEVER have one added later. The abandoners audience is defined by its exclude (`generate_lead`) — add the Exclude group *at creation* or you'll have to rebuild.
- **Use static evaluation** so members don't fall out: on the include event condition, turn on **"True at any point in time"** (event_count / dynamic-lookback) — otherwise dynamic eval drops a user once they stop matching. A lead should stay a lead; an abandoner should stay an abandoner.
- Property limit: 100 audiences (plenty). Each condition ≤ 500 chars.
- [ ] **Leads** audience: use the **suggested audience** instead of building custom — New audience → **Generate leads** tab → "Leads" (or "Submitted Leads"); both are just Include `generate_lead`, prebuilt. (Default Purchasers audience won't populate — no `purchase` event fired.)
- [ ] **Form abandoners** audience: Include → event `form_start`; then Add group to exclude → Permanently exclude users when → event `generate_lead`. Warm-but-didn't-convert; paid-channel version of the abandonment email already sent.
- [ ] Optional 3rd, only after `routing_path` dimension registered AND you'll bid differently: **high-score leads** — Include `generate_lead` with parameter `routing_path` = A. Else YAGNI.
- **Skip predictive audiences entirely** (Likely 7-day purchasers etc.) — need ~1000 returning users triggering/not the event in 28 days; nowhere near that volume. Also all predictive metrics require `purchase`/`in_app_purchase` events, which aren't fired.
- **Skip audience triggers** — they earn their keep only when a milestone is expressible *only* as a multi-condition audience with no direct event. `generate_lead` is already a first-class event, so a trigger would be redundant.
- **GDPR:** sharing an audience to Google Ads for personalized ads needs `ad_user_data` + `ad_personalization` consent, both denied-by-default in Consent Mode v2. So remarketing lists only contain cookie-accepters = likely too small to run for months. Don't wire audience→Ads sharing until Ads runs with real budget.

## Optional / later

- [ ] **Enable "Modeling contributions & business insights"** data-sharing setting (Admin → Account settings → Data sharing) — free one-click toggle. No near-term payoff (predictive metrics need purchase events + volume not present), but it's the prerequisite that lets GA4 later **model conversions lost from cookie-decliners** — recovering signal from the denied-by-default Consent Mode without tracking individuals. Tradeoff: shares aggregated/de-identified data with Google for model improvement — a conscious data-sharing choice. Enable now, benefit arrives with volume.
- [ ] **Lead lifecycle events (close the attribution loop)** — GA4 has a standard lead funnel beyond `generate_lead`: `qualify_lead` → `working_lead` → `close_convert_lead` / `close_unconvert_lead` (+ `disqualify_lead`). Each has a matching suggested audience (Generate leads tab). Firing these when a Firestore lead changes status would let you measure which UTM source/campaign produces leads that actually **become paying clients** — not just form-fills. High-leverage at the low-volume/high-value model, and the GA4-native path to Google Ads offline-conversion optimization (bid toward closes, not leads). **Do when Ads runs with budget** — until then close rate is tracked manually; the event plumbing (backend fires event on status change) isn't worth it yet. `close_convert_lead` is the one that matters; skip the full 6-stage funnel.
- [x] ✅ **web_vital removed** (2026-08-14): deleted import + 5 metric blocks from `analytics-provider.tsx` and uninstalled `web-vitals` dep. Was the noisiest event in a near-empty property; not being acted on. Typechecks clean; working tree, not yet committed.
- [ ] **Consolidate the tag/container IDs** — several Google tag / container IDs have accumulated across setups; audit and keep only what feeds property 529319038. Known so far:
  - `G-ESH71F3XK7` — the **Google tag actually loaded on the site** (via gtag.js) → routes to destination `G-VL0FR2B3DH` (property 529319038). **This is the live, working path.** Verified in production (`window.google_tag_manager` shows only `G-ESH71F3XK7` loaded).
  - `GT-5797Z722` — a Google tag ID from notes; **not loading client-side**. Likely a connected/secondary tag or dormant.
  - ~~orphan GTM container~~ — **deleted 2026-08-14** (was not installed on the site, so removal had no effect on live tracking).
  - `GTM-TSG26723` — a **third** container surfaced by the Google tag gateway setup flow.
  - Action: in GA4 Admin → Data streams → Configure tag settings, confirm only the `G-ESH71F3XK7 → G-VL0FR2B3DH` path is active; delete/ignore the rest. Low urgency; do to reduce confusion.
- [x] ⏭️ **Google tag gateway (first-party mode via Fastly/CDN) — SKIP for now** (evaluated 2026-08-14). Serves the tag + routes measurement through `tovy.eu` instead of `googletagmanager.com`/`region1.analytics.google.com` to evade ad-blockers/ITP. **Not worth it at ~8 sessions/28d** — recovered data is a rounding error, and it adds real edge/CDN infra. The 503 we saw was one browser's own extension, not real visitors (28-day data shows hits landing). **Can't sign in to Fastly because the site is on Firebase Hosting**, which uses Fastly as its *managed* underlying CDN — there's no standalone Fastly account to connect (confirmed via `x-served-by`/`x-cache` Fastly headers). Revisit only at real traffic volume, and then likely via a CDN you control (Cloudflare gateway) or manual setup.
- [ ] **BigQuery Export**: enable for user-level rows / CRM join (join key = the email-hash user_id).
- [ ] **Enhanced Conversions + Customer Match**: revisit ONLY when running real Google Ads with enough volume (~100+ matched users). Ads account is linked (customer 5972626884) but dormant; ads_personalization off. Needs data-stream "user-provided data collection" + privacy-policy disclosure (GDPR). Not the email-hash user_id — different mechanism.

## Already done (reference)

- Reporting Identity = **Blended** (saved; modeling unavailable until traffic grows — behaves as Observed).
- User-ID code implemented; consent-gated, cleared on decline, upgraded to email-hash on submit.
- Zero custom dimensions registered (compliant with User-ID best practices).
- GA Admin + Data APIs enabled on project tax-divider-bridge-prod.
- PII discipline in code: SHA-256 email hash, `sanitizeUrl` strips sensitive query params, form tracking counts fields filled (never values).
- Consent Mode v2, denied-by-default (GDPR-first).
