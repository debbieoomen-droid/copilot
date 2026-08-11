# Rabobank Copilot Instructions — Vanilla HTML/CSS/JS

This file provides GitHub Copilot with the Rabobank coding standards used
throughout the labs.  Place it in `.github/` so Copilot picks it up
automatically in VS Code (requires "Use Instruction Files" enabled).

---

## Language & Environment

- **Runtime:** Browser (ES2022+), no transpiler, no bundler.
- **Module system:** Native ES modules (`import`/`export`); use `type="module"` in `<script>`.
- **Language:** Dutch in UI labels; English in code identifiers, comments, and documentation.

---

## HTML

- Use semantic elements: `<header>`, `<main>`, `<aside>`, `<section>`, `<footer>`, `<nav>`.
- Every interactive element must have an accessible label (`aria-label` or associated `<label>`).
- Never store user input in `data-*` attributes without escaping.
- Use `hidden` attribute (not `display:none`) to temporarily hide elements.

## CSS

- Use CSS custom properties (`var(--name)`) for all colors, spacing, and typography.
- All design tokens are in `css/variables.css` — do not hardcode hex values in component rules.
- Use BEM-style class names: `.block__element--modifier`.
- Prefer `rem`/`em` over `px` for font-sizes and spacing.
- Transition: use `transition: all 0.2s ease` sparingly — prefer specific properties.

## JavaScript

### Modules
- Each file exports named functions/constants — no default exports.
- Keep side effects out of module top-level; wrap in an init function called from `app.js`.

### DOM Manipulation
- **Never** set `innerHTML` with user-supplied or API-fetched string data → XSS risk.
- Use `element.textContent = value` for text nodes.
- Use `document.createElement` + `appendChild`/`prepend` to build DOM trees.
- Batch DOM writes with `DocumentFragment` when inserting multiple nodes.

### Event Handling
- Remove event listeners when components are torn down (store references, call `removeEventListener`).
- Debounce input handlers that trigger network requests (≥ 300 ms delay).
- Prefer `element.addEventListener` over inline `onclick` attributes.

### Async / Networking
- All API calls return `Promise`s — always use `async/await` with `try/catch`.
- Show a loading indicator before awaiting and hide it in `finally`.
- Show user-facing error messages via `showNotification(message, 'error')`, not `console.error` alone.

### Naming Conventions
- Functions: `camelCase` verbs — `renderCaseCard`, `getCases`, `handleSelectCase`.
- Constants: `UPPER_SNAKE_CASE` — `SIMULATED_DELAY`, `PRIORITY_FACTORS`.
- DOM id/class selectors: kebab-case — `#case-list`, `.case-card__subject`.

---

## Security

| Rule | Reason |
|------|--------|
| Never `innerHTML` user data | XSS prevention |
| Mask IBAN in logs and UI | PII protection |
| Do not log full names or customer IDs | Privacy |
| Validate all form inputs before use | Input sanitisation |
| No raw IDs in URLs that correlate to PII | IDOR prevention |

---

## Accessibility

- All images need descriptive `alt` text (decorative images: `alt=""`).
- Color is never the sole indicator of state — use text labels alongside status badges.
- Keyboard navigation must work for all interactive elements (cards, buttons, selects).
- Use `role="status"` or `aria-live="polite"` for dynamically injected content (notifications, search results).

---

## Financial Data Formatting

- Dates: always use `Intl.DateTimeFormat('nl-NL', { … })` — see `formatDateNL()` in `utils/formatters.js`.
- IBAN: display masked form (`maskIBAN()`) in all public-facing UI; raw IBAN only in internal/agent views.
- Monetary amounts: use `Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })`.
