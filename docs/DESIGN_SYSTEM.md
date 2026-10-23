# Manden design system

Status: foundational direction. This document records the visual rules that new UI primitives and product screens should follow. Update it when a design decision changes.

## Direction

Manden uses a soft architectural, editorial visual language: disciplined composition, restrained curvature, strong typography, restrained color, generous whitespace, and property photography as the primary source of visual richness.

The interface should feel precise and dependable without becoming cold or administrative. It may take inspiration from established property marketplaces, but it should not reproduce another product's identity or component styling.

## Core principles

1. **Purposeful curvature.** Small, consistent radii improve usability without turning controls and surfaces into soft capsules.
2. **Photography carries emotion.** UI chrome stays quiet so homes, locations, and surroundings remain dominant.
3. **Yellow is punctuation.** Accent color highlights decisions and state; it is not a general-purpose background for every section.
4. **Hierarchy before decoration.** Scale, weight, spacing, borders, and alignment establish hierarchy before shadows or effects.
5. **Mobile first, never mobile only.** Touch targets and compact layouts must scale into deliberate desktop grids.
6. **Accessible states are part of the design.** Focus, errors, selection, loading, and disabled states must remain clear without relying on color alone.

## Geometry

The system uses a restrained radius scale. Components must use semantic radius tokens instead of arbitrary values.

| Token     | Value    | Usage                                                    |
| --------- | -------- | -------------------------------------------------------- |
| `compact` | `4px`    | Checkboxes, badges, compact filters, small status labels |
| `control` | `6px`    | Buttons, inputs, selects, search fields                  |
| `surface` | `8px`    | Listing cards, media, panels, dropdowns                  |
| `overlay` | `12px`   | Dialogs, drawers, and prominent floating layers          |
| `full`    | `9999px` | Semantically circular elements only                      |

The difference between adjacent levels should remain subtle. Avoid large decorative radii, nested surfaces with competing curvature, and pill-shaped controls used only for visual softness.

Primary controls share one semantic height scale: `sm` is `36px`, `md` is `44px`, and `lg` is `48px`. Buttons, button links, icon buttons, single-line inputs, and dropdown triggers must use these shared sizes so adjacent controls align exactly. `md` is the default for forms; `sm` is intended for compact navigation and filter actions. Multiline inputs and content-driven controls are exempt from fixed control height.

Fully circular geometry is reserved for cases where shape communicates meaning or improves recognition:

- avatars;
- radio controls and status dots;
- toggles;
- loading indicators;
- map pins, user-location markers, and map clusters;
- an icon-only action when a circular hit area is integral to the interaction.

Use `rounded-full` only for these explicit cases. Tags and filter chips may use the `compact` radius; they are not pills by default.

## Color

The CSS variables in `src/shared/styles/theme.css` are the source of truth. Components consume semantic Tailwind utilities such as `bg-surface`, `text-foreground`, and `border-border`, rather than raw hex values.

| Role         | Current value | Usage                           |
| ------------ | ------------- | ------------------------------- |
| Background   | `#ededed`     | Application canvas              |
| Surface      | `#ffffff`     | Cards, controls, panels         |
| Foreground   | `#181c1c`     | Primary text, strong controls   |
| Muted        | `#737979`     | Secondary copy and placeholders |
| Border       | `#c9cece`     | Default separation              |
| Accent       | `#ffe562`     | Primary CTA, focus, selection   |
| Accent hover | `#f2d33f`     | Interactive accent state        |
| Danger       | `#d95345`     | Errors and destructive actions  |
| Success      | `#548a58`     | Confirmed and successful states |

Accent usage should normally be limited to primary calls to action, selected filters or tabs, focus treatment, important notices, and small intentional sections. Large yellow areas require a clear hierarchy or marketing purpose.

## Borders and elevation

- Default border: `1px`.
- Strong, selected, or active border: `2px`.
- Avoid thick decorative outlines on routine controls.
- Inline surfaces and listing cards should usually have no shadow.
- Floating layers may use a restrained hard-offset shadow, for example `4px 4px 0 rgb(24 28 28 / 15%)`.
- Blur-heavy shadows, glass effects, and soft floating cards are outside the core language.

## Typography

Inter Variable is the primary typeface, self-hosted through `next/font` with Latin, Cyrillic, and Vietnamese coverage.

Use the semantic scale defined in `src/shared/styles/theme.css`:

- `text-display` for rare hero statements;
- `text-h1`, `text-h2`, and `text-h3` for page hierarchy;
- `text-body-lg`, `text-body`, and `text-body-sm` for content;
- `text-caption` for supporting metadata.

Prefer sentence case. Uppercase may be used sparingly for compact labels, filters, and overlines, with deliberate letter spacing. Avoid using uppercase for long copy or as a substitute for hierarchy.

## Interaction states

- Primary actions use the yellow accent with dark text.
- Secondary strong actions may use the foreground color with light text.
- Neutral actions use transparent or surface backgrounds with visible borders.
- Hover states should primarily change color or border contrast.
- Pressed states may use a subtle `1–2px` translation.
- Focus-visible treatment uses the accent outline and must never be removed without an accessible replacement.
- Disabled controls must remain legible and must not suggest interactivity.
- Error states require both a visual treatment and an associated text message.

Motion should be short and functional. Avoid springy, playful, or continuously decorative animation. Respect `prefers-reduced-motion`.

## Toast notifications

Transient feedback uses the shared toast system. Toasts support `success`, `error`, `warning`, and `info` variants and must be triggered through `useToast`; feature code should not create one-off fixed notification surfaces.

- Toasts use a neutral surface, a semantic state icon, and a narrow state-colored edge. Meaning must not rely on color alone.
- Error and warning messages use assertive `alert` semantics; success and informational messages use polite `status` semantics.
- Notifications dismiss automatically and always provide an explicit, localized close action.
- Keep messages short and actionable. Persistent or form-specific errors should remain inline when the user needs them to complete a task.
- The SVG state and close icons originate from the curated Roama icon set and are exposed as typed React primitives in `shared/ui/icon`.

## Component architecture

The visual system is split into three layers:

1. `shared/ui`: accessible visual primitives with no form or domain knowledge.
2. `shared/forms`: React Hook Form adapters, validation messages, and localized-field composition.
3. `features/<feature-name>/components`: domain controls such as price, location, amenities, image ordering, and availability.

Each component lives in its own kebab-case folder, for example `features/listings/components/listing-card/ListingCard.tsx`. Component-specific tests and helpers stay alongside the component. Shared form adapters and icons group their individual component folders under a local `components/` directory. Shared UI barrels preserve the existing public exports.

Reuse proven behavior from Roama where appropriate, but adapt styling, types, localization coupling, and accessibility to Manden. Do not copy Roama's strongly rounded visual language or legacy color-class names.

The foundational primitive set currently includes buttons, icon buttons, text inputs, textareas, adaptive dropdowns, date pickers, checkboxes, badges, skeletons, empty states, and toast notifications. Product components should compose these primitives instead of restyling equivalent controls locally.

Adaptive dropdowns replace native selects where a consistent product interaction is useful. They open as anchored popovers from the `md` breakpoint and as bottom sheets on smaller screens. The trigger keeps the `control` radius, desktop menus use the `surface` radius, and mobile sheets use `overlay` only on their exposed upper corners. Dropdowns must preserve normal HTML form submission through a hidden named input, expose listbox semantics, support arrow/Home/End/Enter/Escape navigation, return focus to their trigger, and lock page scroll while the mobile sheet is open. React Hook Form screens use the shared controlled adapter rather than feature-specific wrappers.

Dropdown triggers may use a leading icon when it improves recognition. The default outlined variant remains appropriate for forms; the borderless `ghost` variant is reserved for compact navigation controls such as the locale switcher, where another outlined action is already adjacent.

Date selection uses the shared `DatePicker` built on `react-day-picker` and `date-fns`, matching the proven Roama stack while using Manden geometry and color tokens. It opens as an anchored calendar on desktop and a modal bottom sheet below the `md` breakpoint. Dates remain locale-aware for `en`, `ru`, and `vi`, but form values always use the API-safe `YYYY-MM-DD` format. Native date inputs should only be used when the shared picker cannot support a required platform-specific behavior.

Listing cards keep interface chrome quiet: a white `surface` background and a thin `border-light` outline separate them from the application canvas, without decorative shadows. The fixed-aspect property image sits flush at the top with rounded upper corners; text uses consistent internal padding. Location and facts use muted typography, price remains visually strong, and only featured state and the favorite action overlay the image. The same card styling applies in the catalogue, favorites, and homepage.

The homepage uses an editorial heading paired with a practical search panel, followed by city and landscape entry points, recent homes, a concise explanation of the service, and a landlord call to action. On mobile, the search follows the heading in a single column. City and landscape links come from real API reference data, not fabricated destinations or popularity counts. Recent homes use the existing listing card; an empty catalogue is distinct from a failed request. Marketing copy must not imply that moderation verifies a property or guarantees availability. Yellow is reserved for primary actions and small explanatory markers.

Public listing detail pages prioritize the title and photography, with a full-image gallery and accessible thumbnails for every uploaded photo. Photos fit the main frame without cropping; thumbnails may crop. On desktop, price and contacts occupy a sticky side column; on mobile, they appear directly after the gallery. Facts, terms, amenities, nature, and availability use restrained bordered surfaces. The public calendar is read-only and navigates only the loaded date range; a failed request must never look like unrestricted availability. Contact disclosure remains an explicit authenticated action, with sign-in returning to the same listing.

Long landlord forms use a single-page sequence of numbered sections rather than hiding required context behind a wizard. On desktop, each section pairs a concise sticky summary with its fields; on mobile, the same content becomes a simple vertical flow. The primary save action remains available in a compact sticky action bar, while validation errors stay next to the field that needs attention.

Property coordinates are selected with a MapLibre map rather than exposed as editable latitude and longitude fields. Choosing a catalog location moves the camera but does not silently choose a property point. A click, draggable marker, keyboard marker adjustment, or explicit “use map center” action writes coordinates into the form. Map styles remain provider-independent through `NEXT_PUBLIC_MAP_STYLE_URL`; the default detailed basemap comes from OpenFreeMap and can later be replaced with a provider that offers a production SLA.

## Review checklist

Before adding or approving a component, verify that:

- geometry uses the appropriate semantic radius token rather than an arbitrary value;
- colors and typography come from semantic tokens;
- the component works with keyboard and touch input;
- focus, hover, pressed, disabled, loading, and error states are considered;
- the component remains understandable without color alone;
- spacing and hierarchy do more work than decoration;
- the result works at mobile and desktop widths.
