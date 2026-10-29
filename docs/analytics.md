# Analytics

Two counters run side by side, both without cookies:

- **Vercel Web Analytics and Speed Insights** (`BaseLayout.astro`). Hobby keeps 31 days.
- **Stats**, Antonio's self-hosted [Umami](https://umami.is) at `antoniwan-stats.vercel.app`, shared by all his sites. It keeps history as long as its database lives and records clicks out. The server and its setup are described in [antoniwan.online's docs/analytics.md](https://github.com/antoniwan/antoniwan.online/blob/main/docs/analytics.md).

## What Notes sends

`src/components/Stats.astro` adds the Umami script only when the build has `PUBLIC_UMAMI_HOST` and `PUBLIC_UMAMI_WEBSITE_ID` (set on the Vercel project, Production only). Without them nothing is added.

- `data-domains="notes.antoniwan.online"`: previews and localhost are not counted.
- `data-do-not-track="true"`: a browser that sends Do Not Track is not counted.
- A reader's search (`?q=` on Browse) is removed from the address before it is sent, the same as for Vercel Analytics.
- A click on a link to another site is recorded as the event `outbound`, with `to` (the host) and `url` (the address without its query).

Umami sets no cookie and stores no IP address. To keep your own visits out, run `localStorage.setItem('umami.disabled', 1)` in the browser console on notes.antoniwan.online.
