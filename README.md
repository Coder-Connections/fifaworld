# FIFA World Cup 2026 — Live Scores & Tournament Dashboard

A real-time dashboard for the FIFA World Cup 2026: live scores, match schedules, group standings, knockout brackets, and top scorers — built with Next.js and deployed on Cloudflare Pages.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS with a custom World Cup theme (dark/light mode)
- **Data fetching**: [TanStack React Query](https://tanstack.com/query) for client-side polling
- **Data source**: [football-data.org](https://www.football-data.org/) v4 API
- **Deployment**: Cloudflare Pages via `@cloudflare/next-on-pages` / Wrangler

## Project Structure

```
app/
  api/                # Server-side API routes that proxy football-data.org
    matches/           - list, detail, head-to-head
    scorers/           - top scorers
    standings/          - group/league standings
    teams/              - team list & detail
  groups/              # Group stage standings page
  knockout/            # Knockout bracket page
  matches/             # Match list + match detail pages
  scorers/             # Top scorers page
  teams/               # Teams page
  layout.tsx           # Root layout (providers, sidebar, header, mobile nav)
  page.tsx              # Dashboard (home page)

components/
  matches/, groups/, knockout/, scorers/, teams/   # Domain components
  layout/               # Sidebar, Header, MobileNav
  ui/                   # Loading, error, theme toggle, live indicator

lib/
  football-data.ts      # football-data.org API client (server-side only)
  types.ts               # TypeScript types mirroring the football-data.org schema
  utils.ts               # Date/formatting/status helpers

providers/
  QueryProvider.tsx      # React Query client
  ThemeProvider.tsx      # Dark/light theme
  TimezoneProvider.tsx   # Local timezone handling for match times
```

## Getting Started

### Prerequisites

- Node.js 18+
- A free API key from [football-data.org](https://www.football-data.org/client/register)

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root:

   ```bash
   FOOTBALL_DATA_API_KEY=your_api_key_here
   NEXT_PUBLIC_COMPETITION_CODE=WC
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command              | Description                                              |
| -------------------- | ---------------------------------------------------------- |
| `npm run dev`         | Start the Next.js dev server                              |
| `npm run build`       | Production build                                           |
| `npm run start`       | Start the production server                                |
| `npm run lint`         | Run ESLint                                                  |
| `npm run pages:build` | Build for Cloudflare Pages (`@cloudflare/next-on-pages`)   |
| `npm run preview`      | Build and preview locally via `wrangler pages dev`         |
| `npm run deploy`       | Build and deploy to Cloudflare Pages                        |

## Deployment (Cloudflare Pages)

The app is configured for Cloudflare Pages via `wrangler.toml`. Set the API key as a secret (never commit it):

```bash
wrangler pages secret put FOOTBALL_DATA_API_KEY
```

Then deploy:

```bash
npm run deploy
```

## Data Source

All data comes from the [football-data.org](https://www.football-data.org/documentation/quickstart) API, competition code `WC` (FIFA World Cup). API requests are proxied through internal Next.js API routes (`app/api/*`) so the API key stays server-side and is never exposed to the client.
