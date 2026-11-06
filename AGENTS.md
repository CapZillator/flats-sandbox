<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Structure

- Use a feature/shared architecture, following the approach in `roama-web`: keep domain-specific UI and logic in `src/features/<feature-name>/`, and reusable UI and infrastructure in `src/shared/`.
- Keep `src/app/` focused on Next.js routes, layouts, and composing features.
- Put every new or moved React component in its own kebab-case folder. For example, `MyComponent.tsx` belongs in `my-component/MyComponent.tsx`.
- When multiple sibling components accumulate at the same level, group their individual folders under a local `components/` directory. For example: `src/features/auth/components/auth-form/AuthForm.tsx` and `src/features/auth/components/logout-button/LogoutButton.tsx`.
- Keep child components close to their parent, using `my-component/components/child-component/ChildComponent.tsx`. Place reusable UI components in `src/shared/ui/<component-name>/`.
- Colocate component-specific tests, styles, types, and helpers in the component's folder.
- Keep components in their owning feature or shared module; do not recreate a flat `src/components/` directory.
- Next.js special files such as `page.tsx`, `layout.tsx`, `loading.tsx`, and `error.tsx` stay in their required route locations.

# Code Formatting

- Use `npm run format` to apply Prettier formatting and ESLint fixes together; use `npm run format:check` to verify both.
- Separate `return` from a preceding statement with a blank line. A sole `return` in a block does not need a leading blank line.
- Separate control-flow statements (`if`, `switch`, `try`, `for`, `while`, and `do`) from surrounding statements with blank lines.
- Always use braces for conditional and loop bodies, including early returns.
- Separate adjacent JSX elements, fragments, and expressions on different lines at the same nesting level with a blank line. Preserve inline text and explicit JSX spaces.
- Keep formatting changes free of unrelated behavior changes.

# Control Flow

- Avoid `if/else` branching. Prefer guard clauses and early `return` statements to handle exceptional cases and keep the main execution path flat.
- Avoid `while` and `do...while` loops. Prefer `for`, `for...of`, or array methods appropriate to the task.
- Avoid `switch` where possible. Prefer lookup maps or small functions with early returns when they make the code clearer.

# Product and UI Requirements

- Manden is a housing rental application for Vietnam with three supported locales: English (`en`), Russian (`ru`), and Vietnamese (`vi`). English routes are unprefixed; Russian and Vietnamese routes use `/ru` and `/vi`.
- Put interface copy in the existing shared dictionaries or feature-local copy modules, providing all three translations. Include action labels, validation, loading and empty states, and accessible names. Keep user-provided listing content separate from interface translations and use the existing localized-content fallback helpers.
- Treat `src/shared/styles/theme.css` and `docs/DESIGN_SYSTEM.md` as the visual source of truth. Reuse shared UI components and semantic utilities for colors, typography, and radii. Prefer existing tokens over raw palette classes, arbitrary color values, or duplicate inline styles. If a new visual role is needed, define it in the theme and document its purpose; content-specific colors such as property photographs are not UI theme tokens.
- Page performance is a product requirement, including on mobile connections. Keep client-side code and network requests proportional to the interaction; avoid unnecessary downloads, repeated work, and layout shifts.
- For images, use the project's image delivery and optimization conventions. Match responsive `sizes` to the rendered layout, reserve space with dimensions or an aspect ratio, and select loading behavior based on visibility and importance. Make likely LCP images discoverable early; lazy-load offscreen media and avoid eagerly loading every image or oversized assets without a display need.
- Prefer responsive layout utilities and existing breakpoints to redundant or conflicting style overrides. Verify that styling remains useful across viewport sizes and translated text lengths.

# Review guidelines

- Apply the product and UI requirements above when reviewing changes, alongside functional correctness and accessibility.
- Trace user interactions and data flow beyond the changed lines where context is available. Check loading, error, empty, and repeated-interaction behavior; passing tests alone do not establish correctness.
- Explain a concrete affected scenario and the relevant project rule for each finding. Distinguish functional defects, performance risks, and design-system inconsistencies; do not present an unmeasured performance impact as a measured regression.
- When a conclusion depends on unavailable code, runtime measurements, or an undocumented requirement, state the missing evidence rather than inventing it. Prefer minimal changes consistent with existing project conventions.

# Sending Changes for Review

- When the user asks to send changes for review (for example, «Отправь изменения на ревью»), read and follow `.agents/skills/send-for-review/SKILL.md`.
- That request authorizes relevant checks, a scoped commit, a normal feature-branch push, creating or reusing a PR, and creating or reusing its review monitor. Discussion of the workflow alone does not authorize publication.
- Reuse an existing PR and monitor for the same branch/PR. Do not resume a paused monitor without the user's consent.
- Propose review fixes before applying them. Keep merge decisions with the user.
