# Manden frontend

Next.js App Router frontend for medium- and long-term rentals in Vietnam.

## Local development

Requirements: Node.js 24+, the sibling `flats-back` API, and PostgreSQL configured for the backend.

```bash
cp .env.example .env.local
npm install
npm run dev
```

The frontend always starts at `http://localhost:3001`; the backend uses `http://localhost:3000`. The backend's `FRONTEND_URL` must remain `http://localhost:3001` because cookie authentication uses credentialed CORS.

## Environment

- `API_URL` — server-side API base URL.
- `SITE_URL` — public origin for SEO URLs. Set `https://manden.me` in production and `http://localhost:3001` locally. The production domain is the default when omitted.
- `NEXT_PUBLIC_API_URL` — browser-visible API base URL used for credentialed auth and mutations.
- `NEXT_PUBLIC_MAP_STYLE_URL` — MapLibre-compatible style URL. The development default uses the detailed OpenFreeMap Liberty basemap; production can switch providers without changing components.

MapLibre 6 requires a separate ESM worker. The `predev` and `prebuild` scripts copy the worker and its shared module from the installed `maplibre-gl` package into the generated `public/maplibre/` directory, keeping both files on the same version without committing vendor bundles.

## Architecture

- English is the default locale and uses clean, unprefixed routes (`/listings`, `/login`). Russian and Vietnamese use `/ru` and `/vi` prefixes; `/en/...` is intentionally not exposed.
- The visual language and component rules are documented in [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).
- Tailwind CSS 4 uses a CSS-first theme in `src/shared/styles/theme.css`; UI code consumes semantic color tokens rather than raw palette values.
- Inter Variable is self-hosted through `next/font` with Latin, Cyrillic, and Vietnamese subsets; semantic typography utilities are defined in the Tailwind theme.
- Public reads render in Server Components; interactive auth, favorites, maps, uploads, and calendars stay in focused Client Components.
- Moderation lives at `/admin` (`/ru/admin`, `/vi/admin`) and is gated by the current `ADMIN` session in both the layout and each page, with backend authorization as the final authority. The queue has status filtering and pagination; private reviews use the admin API for all translations, photos, owner contacts and availability notes. Only pending listings expose decisions. Publication requires explicit confirmation and client-side prerequisite checks; rejection mirrors the backend's trimmed 5–1,000-character reason. Mutations refresh caches, handle concurrent decisions, preserve failed form input and hide private data after a 401/403. This is a moderation workspace, not a user/role-management console.
- The homepage composes the `home` feature: a GET search using shared dropdowns and date picker, real city/landscape entry links, six latest published homes, and a landlord CTA that preserves the new-listing return path for guests. Server requests run concurrently with independent error states; a Suspense skeleton covers the initial load. No placeholder listings or unsupported verification claims are shown.
- Favorites render their first page on the server and use TanStack Query for subsequent pages (12 homes per page). Heart mutations invalidate both IDs and paginated lists, roll back on failure, and move back when the last page becomes empty. Loading, retry, empty-list, and expired-session states are localized; authenticated data is only held in the in-memory query cache.
- `src/app` contains routes and layouts that compose feature and shared components.
- `src/features` groups domain UI into `home`, `auth`, `admin`, `listings`, `availability`, `favorites`, `contacts`, `profile`, and `shell`. Each component has its own kebab-case folder under its feature's `components` directory; component tests live alongside it.
- Profile details and contact methods use independent React Hook Form + Zod forms and TanStack Query mutations. Contacts are atomically replaced through the backend contract; IDs are not sent in the replacement payload. The frontend mirrors the 12-contact limit, type-specific validation, duplicate checks, and single-primary rule. Optional localized profile values omit blank translations and send `null` to clear an entire field.
- Published owner listings offer a confirmed “Unpublish” action in account cards and the editor. `POST /listings/:id/unpublish` returns the listing to draft without deleting its photos or availability; publication requires moderation again. Success refreshes owner, moderation, favorite and map caches and removes cached contacts. Deploy the backend endpoint alongside this frontend version; no database migration is required.
- All owner listings offer permanent deletion with explicit confirmation. `DELETE /listings/:id` removes the listing and queues durable Cloudflare cleanup. The UI reports queued cleanup, not falsely completed provider deletion, clears listing/contact/calendar caches, refreshes lists and returns to account listings. Backend retains only a minimal analytical snapshot, not a restorable draft. Deploy its listing-deletion migration alongside this version.
- The optional account-wide `landlordType` (`OWNER` / `REALTOR`) is separate from access roles and self-declared, not verified. Public cards, detail pages, and maps show it. The owners-only filter sends `landlordType=OWNER` to both catalogue and map APIs; unknown types are excluded. Deploy the backend landlord-type migration before this frontend version.
- `src/shared` contains reusable UI, form adapters, API clients, localization, formatting, toast state, and PWA infrastructure. Components have individual folders here as well.
- `src/shared/api` mirrors the checked NestJS controllers, DTOs, and response selects. Browser requests include credentials; server-authenticated requests forward the incoming cookie header.
- Public localized JSON values use `getLocalizedText`, with requested locale → English → first available value fallback.
- The service worker caches only the offline shell and same-origin static assets. API and authenticated data are deliberately never cached. Push hooks are reserved until a backend subscription contract exists.
- Cloudflare images use the backend direct-upload/confirm flow. Delivery URLs are allowed through `next/image` only for `imagedelivery.net`.

## Checks

```bash
npm run lint
npm run format:check
npm test
npm run build
```

Run `npm run format` to format the project with Prettier and apply ESLint fixes. `npm run lint:fix` applies only ESLint fixes. Formatting uses two-space indentation, double quotes, semicolons, and an 80-column target. ESLint requires braces for conditional and loop bodies, blank lines before `return` when another statement precedes it, and blank lines around control-flow statements.

Adjacent JSX elements, fragments, and expressions on different lines at the same nesting level are separated by a blank line using the local ESLint rule `project/jsx-blank-lines`; Prettier preserves those separators. Inline text, explicit JSX spaces, and comments retain their existing spacing.

VS Code workspace settings enable formatting and ESLint fixes on save when the recommended Prettier and ESLint extensions are installed. Generated files, the lockfile, and agent instruction files are excluded from Prettier.

## Currencies

USD, VND and RUB are supported for listing amounts, deposits, display and price
filters. The header selection is saved in the `nestly.currency` cookie for browser
and server rendering. Defaults are USD for English, RUB for Russian and VND for
Vietnamese. The author editor and owner/admin views keep original amounts.

The filter currency describes the entered price range; it does not limit listings
to that currency. Catalogue cards and map markers use the exchange-rate snapshot
returned by the search, so filtering and display agree. Without valid exchange
rates, display falls back to the original amount and currency. Converted amounts
show the original price in their tooltip.

The API must include the multi-currency migration and have `EXCHANGERATE_KEY`
configured. Keys are server-only; the browser receives the saved rates from
`GET /currencies/exchange-rates`.
