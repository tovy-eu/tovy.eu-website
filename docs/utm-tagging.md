# UTM Link Tagging

The #1 lever for knowing where visitors come from. GA4 reads `utm_*` params straight
from the URL — they survive the language redirect and work even on cookieless/denied hits.
Without them, traffic from apps (LinkedIn, Instagram, WhatsApp) strips its referrer and
collapses to `(direct)`. **Tag every link you post.**

## Copy-paste links

| Where you post | Tagged URL |
|---|---|
| LinkedIn (post / profile) | `https://www.tovy.eu/?utm_source=linkedin&utm_medium=social` |
| Instagram (bio / story) | `https://www.tovy.eu/?utm_source=instagram&utm_medium=social` |
| WhatsApp / DMs | `https://www.tovy.eu/?utm_source=whatsapp&utm_medium=referral` |
| Email signature | `https://www.tovy.eu/?utm_source=signature&utm_medium=email` |
| Newsletter | `https://www.tovy.eu/?utm_source=newsletter&utm_medium=email&utm_campaign=<name>` |

Deep-linking to a specific page? Keep the params, just change the path:
`https://www.tovy.eu/en/project-request/?utm_source=linkedin&utm_medium=social`

## Naming convention (keep it consistent or reports fragment)

- **utm_source** = the platform: `linkedin`, `instagram`, `whatsapp`, `newsletter`, `signature`
- **utm_medium** = the channel type: `social` (feeds), `referral` (DMs/links), `email`, `cpc` (paid)
- **utm_campaign** = optional, the specific push: `launch2026`, `q3-outreach`
- Lowercase, no spaces (use `-`). `linkedin` and `LinkedIn` are two different sources to GA.

## What NOT to tag

- Organic search + genuine site-to-site referrals — GA4 attributes those on its own.
- Internal links between your own pages — never add UTMs, it restarts attribution.

## Where this is wired in code

`captureAttribution()` (`src/lib/tracking.ts`) reads these on landing, first-touch-wins, and
persists them for the session so they survive the multi-step intake form. GA4 also reads
them natively. See also [analytics-todos.md](./analytics-todos.md).
