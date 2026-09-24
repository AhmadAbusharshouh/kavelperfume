# ADR 0001: Cloudflare Edge Architecture with OpenNext, D1, and R2

## Status
Accepted

## Context
Kavel Perfume is a high-traffic direct-to-consumer perfume e-commerce store operating in Jordan. To achieve instant TTFB (<50ms) across Jordan and MENA ad traffic (Instagram/Facebook/TikTok), zero cold starts, and resilience against flash ad surges without paying high container/VPS bills, we must choose an edge-native runtime.

## Decision
Deploy Next.js 15 App Router using `@opennextjs/cloudflare` on Cloudflare Workers, paired with Cloudflare D1 (serverless SQLite at edge) via Drizzle ORM, and Cloudflare R2 for asset storage.

## Consequences
### Positive
- Instant edge rendering and sub-50ms latency across Jordanian ISPs (Zain, Orange, Umniah).
- Native integration with Cloudflare Workers AI for the interactive Fragrance Sommelier.
- Extremely low cost with zero idle server fees.

### Negative
- OpenNext Cloudflare requires edge-compatible packages (no native Node.js C++ bindings).
