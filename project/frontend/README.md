# Rabobank Case Summary — HTML/CSS/JS Starter Project

A **zero-dependency** starter project for the Rabobank GitHub Copilot labs.  
No build step, no npm, no bundler — open `index.html` directly in a browser or
via VS Code Live Server (port 5501).

---

## Quick Start

1. Open this folder in VS Code.
2. Start **Live Server** (`Go Live` button in the status bar).
3. The app is served at `http://localhost:5501/training/rabobank/starter-project-html/`.

> **Or** just double-click `index.html`. All paths are relative so it works from
> the file system too (note: ES modules require a server; use Live Server).

---

## Project Structure

```
starter-project-html/
├── index.html                   # App shell — header, sidebar, main, footer
├── css/
│   ├── reset.css                # Minimal CSS reset
│   ├── variables.css            # CSS custom properties (design tokens)
│   └── styles.css               # All component and layout styles
├── js/
│   ├── app.js                   # Entry point — bootstraps everything
│   ├── state.js                 # Tiny reactive state store
│   ├── api.js                   # Mock API layer (returns Promises)
│   ├── data.js                  # In-memory mock data (10 cases)
│   ├── utils/
│   │   └── formatters.js        # Date, IBAN, priority helpers
│   └── components/
│       ├── notification.js      # Lab 1 — NotificationBanner stub
│       ├── case-card.js         # Lab 2 — Legacy string concat (to refactor)
│       ├── case-list.js         # Lab 6 — List renderer (to optimise)
│       ├── case-detail.js       # Detail view with notes timeline
│       └── admin.js             # Lab 4 — XSS-vulnerable admin search
└── data/
    └── cases.json               # Same mock data as JSON (for reference)
```

---

## Labs

Each lab maps to one or more files.  
The relevant file contains a `╔══╗` comment block describing the task.

### Lab 1 — NotificationBanner

**File:** `js/components/notification.js`  
**Task:** Implement the `showNotification(message, type)` function stub.

- Create a `<div>` with class `.notification .notification--{type}`
- Append it to `#notification-area` in `index.html`
- Auto-dismiss after 4 seconds
- Add a close (×) button
- Animate in/out using a CSS transition

**Copilot prompt to start:**
> "Implement showNotification using the DOM API. The banner should auto-dismiss
> after 4 seconds with a slide-in animation using the .notification CSS classes."

---

### Lab 2 — Refactor CaseCard

**File:** `js/components/case-card.js`  
**Task:** The `renderCaseCard` function builds HTML via string concatenation.

1. Refactor to **template literals**
2. Then refactor to the **DOM API** (`createElement`, `textContent`)
3. Ensure XSS is impossible (never set `innerHTML` with user data)
4. Add `aria-label` to the card

**Copilot prompt to start:**
> "Refactor renderCaseCard to use the DOM API instead of string concatenation.
> Use textContent for all user data to prevent XSS."

---

### Lab 3 — Form Validation

**File:** create `js/validate.js`  
**Task:** Write a validation module for the "create case" form.

Requirements:
- `validateCaseForm(formData)` returns `{ valid: boolean, errors: Record<string, string> }`
- Subject must be at least 10 characters
- IBAN must match Dutch IBAN format (`NL\d{2}[A-Z]{4}\d{10}`)
- Customer name must not be empty
- Description must be at most 500 characters

**Copilot prompt to start:**
> "Create a validate.js module with a validateCaseForm function that checks
> the rules defined in the README and returns { valid, errors }."

---

### Lab 4 — Security: Fix XSS

**File:** `js/components/admin.js`  
**Task:** The admin search panel contains XSS vulnerabilities.

To see the bug: go to the Admin tab and type:
```
<img src=x onerror="alert('XSS!')">
```

Fix all `innerHTML` assignments that use user data.

**Copilot prompt to start:**
> "Fix the XSS vulnerability in this admin component. Replace innerHTML
> assignments that use user data with safe DOM API alternatives."

---

### Lab 5 — Unit helpers: fix calculatePriorityScore

**File:** `js/utils/formatters.js`  
**Task:** The `calculatePriorityScore` function contains three intentional bugs.

Find and fix:
1. Division by zero / zero score when case is opened today
2. Escalation bonus applied even to resolved/closed cases
3. Missing `'critical'` entry in `PRIORITY_FACTORS`

Write manual test assertions:
```js
// In browser console:
import { calculatePriorityScore } from './js/utils/formatters.js';
console.assert(calculatePriorityScore({ priority:'critical', status:'open', createdAt: new Date().toISOString() }) > 0, 'Score should be > 0 on day 0');
```

**Copilot prompt to start:**
> "Review calculatePriorityScore for edge cases and fix any bugs you find.
> Then write console.assert tests for the edge cases described in the comments."

---

### Lab 6 — Performance: optimise CaseList rendering

**File:** `js/components/case-list.js`  
**Task:** The list re-renders every DOM node on every keypress.

1. Wrap `onFilterChange` in a **debounce** helper (300 ms)
2. Replace the one-by-one append loop with a **`DocumentFragment`**
3. *(Stretch)* Implement a simple virtual list: only render visible cards

**Copilot prompt to start:**
> "Add a debounce wrapper to the search input handler and use DocumentFragment
> in renderCaseList for better DOM performance."

---

## Domain Model

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | Unique case identifier |
| `customerId` | `string` | Customer reference |
| `customerName` | `string` | Full name |
| `iban` | `string` | Dutch IBAN (masked in UI) |
| `category` | `string` | complaint, question, fraud-report, … |
| `status` | `string` | open, in-progress, waiting-customer, escalated, resolved, closed |
| `priority` | `string` | low, medium, high, critical |
| `subject` | `string` | Short title |
| `description` | `string` | Full description |
| `assignedAgent` | `string \| null` | Agent name |
| `createdAt` | `ISO string` | Creation timestamp |
| `updatedAt` | `ISO string` | Last update timestamp |
| `resolvedAt` | `ISO string \| null` | Resolution timestamp |

---

## Coding Standards

See [`.github/copilot-instructions.md`](.github/copilot-instructions.md) for
the Rabobank-specific standards used throughout the labs.

---
