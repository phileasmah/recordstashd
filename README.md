# RecordStashd

A full-stack social album review platform where users can search the Spotify catalogue, rate and review albums, follow other listeners, and discover what's popular. Built with Next.js 16, React 19, Convex, and the Spotify Web API.

**Live site:** [recordstashd.com](https://recordstashd.com)

![Home page](images/home-page.png)

## Features

- **Search & browse** any album in the Spotify catalogue with real-time search
- **Rate & review** albums on a 5-star scale with written reviews
- **Social feed** — follow other users and see their latest activity
- **Popular reviews** — discover trending reviews ranked by likes
- **New releases carousel** — stay up to date with the latest drops
- **User profiles** with review history, follower/following counts, and monthly stats
- **Album detail pages** with track listings, metadata, and aggregate ratings
- **Direct Spotify links** to listen to albums instantly

<details>
<summary><strong>More screenshots</strong></summary>

### Album Page
![Album page](images/album-page.png)

### Profile Page
![Profile page](images/profile-page.png)

</details>

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Server Components, Turbopack) |
| UI | React 19, Tailwind CSS 4, shadcn/ui, Radix UI |
| Backend | Convex (real-time database, serverless functions) |
| Auth | Clerk (OAuth, webhook sync to Convex) |
| External API | Spotify Web API |
| Language | TypeScript (strict mode, end-to-end type safety) |

## Architecture & Technical Highlights

### API Abstraction Layer

The data fetching layer is decoupled from any single music provider. Album lookups support two strategies — direct ID-based fetch and a search-by-name fallback — so the core business logic is not tightly coupled to Spotify. Switching to or adding Apple Music as a data source would not require changes to the review, social, or routing layers.

### Async Background Jobs for Non-Blocking UI

When a user reviews an album for the first time, the review is persisted immediately while an **internal Convex action** runs in the background to fetch supplementary metadata (cover art URLs, Spotify album links). This keeps the write path fast and the UI non-blocking, even during high-frequency interactions. The Spotify API token itself is cached in the database with TTL-aware reuse to minimise redundant OAuth handshakes.

### SEO-First URL Routing

Album pages use human-readable slugs (`/albums/john-mayer/where-the-light-is`) rather than opaque Spotify IDs. The Spotify ID is passed as an optional query parameter and used only as a lookup hint — the slug is the canonical identifier. This improves search engine indexing, produces shareable URLs, and reduces external vendor lock-in. A custom slug generation utility handles encoding of special characters and edge cases.

### Real-Time Aggregations at Scale

Rather than computing averages and counts on the fly, the app uses the [Convex Aggregate](https://github.com/get-convex/aggregate) library to maintain pre-computed, incrementally updated aggregates (average album rating, per-user review counts, follower/following counts). Database **triggers** keep these aggregates consistent on every write — no cron jobs or manual cache invalidation needed.

### Reactive Data & Multi-Source Stream Merging

Convex queries are **live by default** — any mutation instantly propagates to every connected client. The social feed merges paginated review streams from all followed users into a single chronologically sorted feed using Convex's stream merging primitives, with cursor-based pagination for efficient loading at scale.

### Webhook-Driven Identity Sync

User creation, updates, and deletions in Clerk are propagated to Convex via **Svix-verified webhooks**. Deleting a user triggers cascading cleanup of all their reviews, likes, and follow relationships through Convex's trigger system — maintaining referential integrity without traditional foreign key constraints.

### Server & Client Rendering Strategy

- **Server Components** with `fetchQuery()` for initial page loads (SEO-friendly, fast TTFB)
- **Client-side real-time subscriptions** via `useQuery()` for live updates after hydration
- **ISR** (Incremental Static Regeneration) for the new releases section, revalidated every 2 days
- **Suspense boundaries** with skeleton loading states throughout

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── albums/[artistName]/[albumName]/   # SEO-friendly album pages
│   ├── [username]/         # Dynamic user profile pages
│   ├── following/          # Social activity feed
│   ├── reviews/popular/    # Trending reviews
│   └── api/search/         # Spotify search proxy
├── components/             # React components (albums, reviews, navigation, ui)
├── hooks/                  # Custom React hooks
├── lib/                    # Spotify API client, utilities
└── types/                  # Shared TypeScript types

convex/
├── schema.ts               # Database schema & indexes
├── reviewsWrite.ts         # Review CRUD mutations
├── reviewsRead.ts          # Review queries & pagination
├── reviewAggregates.ts     # Pre-computed aggregation queries
├── reviewLikes.ts          # Like/unlike logic
├── follows.ts              # Follow relationships & counts
├── users.ts                # Clerk webhook sync & user queries
├── spotify.ts              # Spotify token caching & API calls
└── http.ts                 # Webhook HTTP endpoint
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Convex](https://www.convex.dev/) account
- A [Clerk](https://clerk.com/) application
- [Spotify Developer](https://developer.spotify.com/) client credentials

### Run Locally

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables — configure Clerk and Spotify credentials in your Convex dashboard (see Convex docs for `auth.config.ts` setup).

3. Start the Convex backend and Next.js dev server:
   ```bash
   npx convex dev   # in one terminal
   npm run dev       # in another terminal
   ```

4. Open [http://localhost:3000](http://localhost:3000).
