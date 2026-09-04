# 🏦 GitHub Copilot Workshop — Rabobank Case Summary Tool

Welcome to the **GitHub Copilot for Developers** hands-on workshop! This workshop guides you through AI-powered development using a real Rabobank internal tool: a **Customer Case Summary** application built with **Vanilla HTML/CSS/JavaScript** (frontend) and **Java 17 + Spring Boot 3** (backend).

> **Note:** No expert-level JavaScript or Java knowledge is required. GitHub Copilot generates most of the code — this is your opportunity to learn how to steer AI effectively in a professional banking context.

---

## 🎯 Workshop Objectives

By the end of this workshop, you will master:

- **Core Copilot Features**: Chat, code completions, inline chat (`Ctrl+I`), and `/slash` commands
- **Context & Instructions**: Custom instructions, prompt files, and custom chat modes
- **Code Quality**: Security review, refactoring, documentation, and unit testing
- **Advanced Workflows**: Agent mode, vision input, and performance optimization
- **Banking Context**: How to critically evaluate AI-generated code in a regulated environment

---

## 📋 Prerequisites

### Required

1. **GitHub Copilot License**: Active GitHub Copilot subscription (pro or business tier)
2. **VS Code**: Latest version with the **GitHub Copilot** and **GitHub Copilot Chat** extensions installed
3. **Live Server**: Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in VS Code
4. **Verify Copilot works**: Open a `.js` file and confirm that inline suggestions appear

### For Backend Labs (optional)

5. **Java 17+**: Verify with:
   ```bash
   java -version
   ```
6. **Maven**: Verify with:
   ```bash
   mvn -version
   ```

---

## 🚀 Quick Start

### Frontend (no build step required)

1. **Open the project in VS Code:**
   ```bash
   cd "project/frontend"
   code .
   ```

2. **Start Live Server:**
   - Click the **Go Live** button in the VS Code status bar
   - Or right-click `index.html` → _Open with Live Server_

3. **Open the app:**
   Navigate to [http://localhost:5500](http://localhost:5500) in your browser

4. **Verify the app loads:**
   You should see the Rabobank Case Summary dashboard with a sidebar listing customer cases.

> The app runs entirely in the browser using **mock data** by default — no backend needed to start.

### Backend (Spring Boot — optional for real API calls)

1. **Start the backend:**
   ```bash
   cd "project/backend"
   mvn spring-boot:run
   ```
   The backend will run on [http://localhost:8080](http://localhost:8080)

2. **Switch to real backend in the frontend:**
   Open `js/config.js` and set:
   ```js
   export const USE_REAL_BACKEND = true;
   ```

3. **Reload the browser** — the mode badge in the header will change from _Mock data_ to _Live backend_.

---

## 🏦 Application Overview

**Rabobank Case Summary** — a tool for customer service agents handling daily cases:

- 📋 **Case List**: Browse open cases filtered by status, priority, and category
- 🔍 **Case Detail**: View full case info including customer IBAN (masked) and interaction timeline
- 🔔 **Notifications**: Dismissable banners for success, error, warning, and info messages
- 🔐 **Admin Panel**: Search across cases by customer name, subject, or case ID
- 📡 **Dual Mode**: Works with mock data (offline) or connected to the Spring Boot backend

---

## 🏗️ Architecture

```
Browser (http://localhost:5500)
    ↓ ES module imports
app.js  →  state.js (reactive store)
    ↓
api.js  →  mock data (data.js)  OR  Spring Boot backend (localhost:8080)
    ↓
components/
  ├── case-list.js      → renders sidebar case cards
  ├── case-card.js      → individual case card element
  ├── case-detail.js    → full case detail panel
  ├── admin.js          → admin search panel
  └── notification.js   → dismissable notification banners
utils/
  └── formatters.js     → date formatting, IBAN masking, priority scoring
```

### Backend (Spring Boot)
- **Port**: 8080
- **API Base**: `/api/v1/`
- **Endpoints**: `GET /api/v1/cases`, `GET /api/v1/cases/{id}`, `POST /api/v1/cases`, `PATCH /api/v1/cases/{id}/status`

---

## 🛠️ Technology Stack

### Frontend
- **Language**: Vanilla JavaScript (ES2022 modules) — no React, no bundler
- **Styling**: CSS3 with custom properties (design tokens in `variables.css`)
- **Data**: Mock mode (in-memory) or real REST API via `fetch()`
- **Testing**: vitest (already configured — run `npm install` once, then `npm test`)

### Backend
- **Framework**: Java 17 + Spring Boot 3
- **Database**: H2 in-memory (development), PostgreSQL-compatible
- **API Design**: RESTful, versioned at `/api/v1/`
- **Security**: CORS restricted, parameterized queries, PII masking

---

## 📁 Project Structure

```
project/
├── frontend/                        ← Vanilla HTML/CSS/JS (no build step)
│   ├── index.html                   ← App shell — header, sidebar, main, footer
│   ├── css/
│   │   ├── reset.css                ← Minimal CSS reset
│   │   ├── variables.css            ← CSS custom properties (design tokens)
│   │   └── styles.css               ← All component and layout styles
│   ├── js/
│   │   ├── app.js                   ← Entry point — bootstraps everything
│   │   ├── state.js                 ← Tiny reactive state store
│   │   ├── api.js                   ← API layer: mock or real backend
│   │   ├── data.js                  ← In-memory mock data (10 cases)
│   │   ├── config.js                ← USE_REAL_BACKEND toggle + API_BASE_URL
│   │   ├── utils/
│   │   │   └── formatters.js        ← Date, IBAN, priority (Lab 5: bugs!)
│   │   └── components/
│   │       ├── notification.js      ← Lab 1 — stub, not yet implemented
│   │       ├── case-card.js         ← Lab 2 — string concat, to refactor
│   │       ├── case-detail.js       ← Detail view with note timeline
│   │       ├── case-list.js         ← Lab 6 — performance issues
│   │       └── admin.js             ← Lab 4 — XSS vulnerability
│   └── data/
│       └── cases.json               ← Mock data as JSON (for reference)
│
├── backend/                         ← Java 17 + Spring Boot 3
│   └── src/main/java/nl/rabobank/casesummary/
│       ├── controller/              ← REST endpoints
│       ├── service/                 ← Business logic
│       ├── repository/              ← Spring Data JPA
│       ├── model/                   ← JPA entities
│       ├── dto/                     ← Data Transfer Objects
│       └── config/                  ← CORS + DataLoader
│
└── .github/
    └── copilot-instructions.md      ← Custom Copilot instructions for this project
```

---

## 🔧 Development Commands

### Frontend
```bash
# No installation needed — open index.html via Live Server in VS Code
# Or via terminal with npx:
npx serve frontend/
```

### Backend
```bash
cd backend
mvn spring-boot:run          # Start on port 8080
mvn test                     # Run all tests
mvn spring-boot:run -Dspring-boot.run.arguments=--debug   # With debug logging
```

---

# 📖 Workshop Instructions

## Task 0 — Setup & Model Selection

### 0.1 Open the project in VS Code

1. Open the `project` folder in VS Code
2. Start **Live Server** for the frontend (`index.html` → _Open with Live Server_)
3. Verify that the app loads at [http://localhost:5500](http://localhost:5500)
4. Explore the app: click cases, view the detail panel, try the Admin panel

### 0.2 Choose your AI model

Select the right model for the task:

- **A fast GPT-5 model** (e.g. GPT-5 mini): Suitable for component generation, refactoring, documentation, and bug fixes
- **A stronger reasoning model** (or the best model available to you): Excellent for complex code analysis, security reviews, and agent mode tasks

**Switch model:**
1. Open GitHub Copilot Chat
2. Click on the model selector dropdown
3. Select the desired model per task

---

## Task 1 — Core Copilot Basics

### 1.1 Repository Exploration

**Imagine: you are a new developer starting at Rabobank today. You need to understand the project and architecture.**

Open Copilot Chat and ask the following questions (type them one by one, don't copy-paste):

- `#codebase Can you explain the architecture of this application?`
- `#codebase How do the frontend components communicate with each other?`
- `#codebase Where is the state managed and how does a case selection flow through the app?`
- `#codebase What is the difference between mock mode and real backend mode?`
- `#codebase Which files are relevant for Lab 1 about the NotificationBanner?`

### 1.2 Exploring technologies with `@github`

Use Copilot's web search features to learn more about the technologies used:

**Instructions:**
1. Open Copilot Chat in Ask mode
2. Ask these questions one by one:
   - `@github How do ES modules work in vanilla JavaScript without a bundler?`
   - `@github What are CSS custom properties and how do I use them for theming?`
   - `@github How does the Fetch API handle error states in JavaScript?`
   - `@github What is the difference between textContent and innerHTML and when is innerHTML dangerous?`
   - `@github How do I implement a debounce function in vanilla JavaScript?`

> **Tip:** If you see Bing as a reference source in the response, `@github` is performing a live web search.

### 1.3 Role Prompting & Custom Instructions

Custom instructions let you structurally guide Copilot without repeating the same context every time.

**Instructions:**
1. Open `.github/copilot-instructions.md` in the `frontend/` folder
2. Read the existing instructions — these are already configured for Rabobank conventions
3. Test the instructions by asking Copilot Chat:
   - `"Write a new JavaScript utility function for formatting a Dutch phone number"`
   - Check whether Copilot automatically adds JSDoc, uses `const`/`let`, and respects the Rabobank style
4. Add an extra instruction to the file, for example:
   ```
   - Always use Dutch variable names for domain objects (klant, zaak, iban)
   - Never use `var` — always use `const` or `let`
   ```
5. Test again — notice how the suggestions change

### 1.4 Code Review with Copilot

**Instructions:**
1. Open `js/components/case-card.js`
2. Select all code and right-click → **Copilot** → **Review**
3. Review the feedback — pay attention to comments about `innerHTML`, string concatenation, and XSS
4. Ask Copilot Chat: _"What are the top 3 problems with this code from a security and maintainability perspective?"_
5. Repeat for `js/utils/formatters.js` — Copilot should notice the intentional bugs

### 1.5 Generate documentation with `/doc`

**Instructions:**
1. Open `js/api.js`
2. Select the `apiFetch` function (lines ~50–70)
3. Press `Ctrl+I` and type: `/doc`
4. Review the generated JSDoc — is the description of the parameters and return value correct?
5. Also generate documentation for `simulateFetch` and `slugify`
6. Open `js/components/case-detail.js` and generate JSDoc for the helper functions `buildInfoCard` and `buildTimeline`

> **Tip:** Copilot generates better documentation when the filename and surrounding code are clear. Keep related files open in VS Code.

### 1.6 Fix code — implement the NotificationBanner

The `showNotification()` function in `js/components/notification.js` is an empty stub. The app already uses it everywhere, but it does nothing.

**Instructions:**
1. Open `js/components/notification.js`
2. Read the task description in the JSDoc comments at the top of the file
3. Also open `css/variables.css` and `css/styles.css` so Copilot has the CSS classes as context
4. Press `Ctrl+I` and type:
   ```
   Implement showNotification using the DOM API.
   Append a banner to #notification-area in index.html.
   Auto-dismiss after 4 seconds for info and success variants.
   Add a close (×) button. Use the .notification and .notification--{type} CSS classes.
   Animate in with a slide-in transition.
   ```
5. Verify that the existing `.notification` classes in `styles.css` are being used (search for `.notification`)
6. Test in the browser: open the browser console and call `showNotification('Test!', 'success')`

### 1.7 Generate Unit Tests

`formatters.js` contains the `calculatePriorityScore()` function with **three intentional bugs**. Use Copilot to generate tests that expose the bugs.

**Instructions:**
1. Open `js/utils/formatters.js` and read the comments at `calculatePriorityScore`
2. Create a new file `js/utils/formatters.test.js`
3. Select all code in `formatters.js` and press `Ctrl+I` → type: `/tests`
4. Improve the generated tests by asking Copilot Chat:
   _"/tests Generate tests specifically for calculatePriorityScore covering: (1) daysOpen = 0, (2) priority = 'critical', (3) resolved cases with status 'resolved', (4) escalated cases. Show which tests currently fail due to bugs."_
5. Add a **describe block** and run the tests with Node.js:
   ```bash
   node --experimental-vm-modules js/utils/formatters.test.js
   ```
   Or use the configured test runner (vitest): `npm install`, then `npm test`
6. For each failing test: select the error message, press `Ctrl+I` → `/fix`

> **Expected behavior:** Three tests should fail — that is correct. The tests expose the existing bugs.

### 1.8 Optimize code

The `renderCaseList()` in `case-list.js` causes unnecessary DOM reflows on every keystroke in the search bar.

**Instructions:**
1. Open `js/components/case-list.js` and read the `TODO Lab 6` comments
2. Select the `renderCaseList` function
3. Ask Copilot Chat (use the best model available to you for best results):
   _"Optimize this renderCaseList function. Replace the append-one-by-one loop with DocumentFragment to batch all DOM insertions in a single operation. Explain why this is faster."_
4. Review the optimization and accept or adjust
5. Then ask: _"Also wrap the onFilterChange callback in bindSearchInput in a debounce function with a 300ms delay. Explain what debouncing is and why it matters for a search input."_

---

## Task 2 — Intermediate Copilot Features

### 2.1 Custom Chat Modes

Custom chat modes create specialized AI assistants for specific tasks.

**Instructions:**
1. Create a new file: `.github/chatmodes/security-reviewer.chatmode.md`
2. Add the following content:
   ```markdown
   # Security Reviewer — Rabobank Frontend

   You are a security reviewer for Rabobank front-end code.

   ## Instructions
   - Always look for XSS vulnerabilities (innerHTML with user data)
   - Check for PII exposure (IBAN, BSN, passwords in logs or UI)
   - Verify that server-side authorization is present for sensitive actions
   - Flag client-side-only authentication checks as insecure
   - Suggest DOM API alternatives instead of innerHTML
   - Report your findings in the format: RISK | LOCATION | RECOMMENDATION
   ```
3. Use the new mode from the Copilot Chat mode picker
4. Have the security reviewer assess `js/components/admin.js`

### 2.2 Prompt Files

**Instructions:**
1. Create a new file: `.github/prompts/rabobank-component.prompt.md`
2. Add:
   ```markdown
   Rabobank frontend component checklist:
   - Use the DOM API (createElement, textContent) — never innerHTML with user data
   - Add aria-label to all interactive elements
   - Use CSS classes from variables.css for colors (--color-primary, --color-accent)
   - Export the main function as a named export
   - Add JSDoc with @param and @returns
   - Ensure each component works without a framework (pure DOM API)
   ```
3. Add this prompt file as context in Copilot Chat when creating a new component
4. Ask Copilot: _"Create a new LoadingSpinner component following the Rabobank component checklist"_

### 2.3 Chat Rollback & Prompt Editing

**Instructions:**
1. Ask Copilot Chat to create a new `filterCases(cases, query)` utility function
2. Click on your original prompt in the chat history and edit it:
   _"Also handle filtering by status and priority, and make the function case-insensitive for all string comparisons"_
3. Switch to a different model in the dropdown and apply again
4. Compare the generated implementations from both models

---

## Task 3 — Copilot Agent Mode

### 3.1 Build a new feature with Agent Mode

GitHub Copilot's agent mode can work autonomously across multiple files, recognize errors, and self-correct.

**Instructions:**
1. Open Copilot Chat → choose **Agent mode** → select the best model available to you
2. Ensure the frontend is running via Live Server
3. Provide this prompt:

```
Let's add a Statistics page to the Rabobank Case Summary tool.

1. Create a new view section in frontend/index.html (data-view="stats") with a nav button "Statistics"
2. Create a new file frontend/js/components/stats.js that renders case statistics:
   - Total number of cases per status (open, in-progress, resolved, escalated)
   - Number of cases per category (complaint, fraud-report, loan-request, etc.)
   - Average priority score using calculatePriorityScore from utils/formatters.js
3. Display the statistics as simple cards using existing CSS classes from styles.css
4. Wire it up in app.js so the stats view is rendered when the nav button is clicked
5. All DOM manipulation must use the DOM API — no innerHTML with data
```

**💡 Agent Mode tips:**
- Be specific: include exact file paths
- Number your steps — agent mode works best sequentially
- Mention the existing CSS classes to keep the style consistent
- End with: _"Implement step by step and let me review each change"_

4. Review the proposed changes step by step and accept or provide feedback
5. Test in the browser: click on "Statistics" in the navigation

### 3.2 Vision — creating a component from a sketch

**Instructions:**
1. Create a sketch (or screenshot) of a desired UI component, for example a "Case Status Badge" with color coding
2. Open Copilot Chat with the best model available to you
3. Drag the image to the chat window
4. Ask:
   ```
   Create a Rabobank Case Status Badge component based on this image.
   Use the DOM API (no innerHTML with data), apply CSS classes from variables.css,
   and export it as renderStatusBadge(status).
   ```
5. Integrate the component into `case-card.js`

---

## Task 4 & 5 — MCP Servers & Copilot CLI (not in this training)

> MCP servers and the Copilot CLI are covered in a separate advanced training. Public MCP servers are blocked on the Rabobank network.

## 🔒 Security Guidelines

In a banking environment, high security standards apply. Use this checklist for every Copilot-generated code:

| Risk | What to check |
|------|---------------|
| **XSS** | Never use `innerHTML` with user data — use `textContent` or the DOM API |
| **PII exposure** | IBAN and BSN must be masked in the UI and logs |
| **Client-side auth** | UI hides are cosmetic — authorization belongs server-side |
| **Injection** | Ensure search terms are not evaluated as HTML or SQL |
| **Sensitive data in localStorage** | Do not store roles, tokens, or PII in localStorage |

> Copilot does not understand your authorization model. Always critically evaluate generated security code.

---

## 📚 Reference: Lab ↔ File Mapping

| Lab | File | Learning Goal |
|-----|------|---------------|
| FE Lab 1 | `js/components/notification.js` | Generate component & DOM API |
| FE Lab 2 | `js/components/case-card.js` | Refactoring: string concat → DOM API |
| FE Lab 3 | `js/components/case-detail.js`, `js/utils/formatters.js` | Code review & documentation |
| FE Lab 4 | `js/components/admin.js` | XSS detection & safe DOM manipulation |
| FE Lab 5 | `js/utils/formatters.js` (`calculatePriorityScore`) | Unit tests & bugfixing |
| FE Lab 6 | `js/components/case-list.js` | Performance: DocumentFragment + debounce |

## What is this?

Rabobank customer service agents handle thousands of cases daily — complaints, questions, loan requests, and fraud reports. This tool helps agents:

- **View** open customer cases with status and priority
- **Summarize** case interactions into structured notes
- **Search** cases by customer, date, or category
- **Manage** case assignments and escalations

## Project structure

```
project-1-rabobank-case/
├── frontend/                        → Vanilla HTML/CSS/JS (no build step required)
│   ├── index.html                   → App shell — header, sidebar, main, footer
│   ├── css/
│   │   ├── reset.css                → Minimal CSS reset
│   │   ├── variables.css            → CSS custom properties (design tokens)
│   │   └── styles.css               → All component and layout styles
│   ├── js/
│   │   ├── app.js                   → Entry point — bootstraps everything
│   │   ├── state.js                 → Reactive state store
│   │   ├── api.js                   → Mock API layer (returns Promises)
│   │   ├── data.js                  → In-memory mock data (10 cases)
│   │   ├── config.js                → Configuration settings
│   │   ├── utils/
│   │   │   └── formatters.js        → Date, IBAN, and priority helpers
│   │   └── components/
│   │       ├── notification.js      → Lab 1 — NotificationBanner stub
│   │       ├── case-card.js         → Lab 2 — Legacy string concat (to refactor)
│   │       ├── case-list.js         → Lab 6 — List renderer (to optimize)
│   │       ├── case-detail.js       → Detail view with note timeline
│   │       └── admin.js             → Lab 4 — XSS-vulnerable admin panel
│   └── data/
│       └── cases.json               → Mock data as JSON (for reference)
│
├── backend/                         → Java 17 + Spring Boot 3
│   ├── src/main/java/nl/rabobank/casesummary/
│   │   ├── controller/              → REST endpoints
│   │   ├── service/                 → Business logic
│   │   ├── repository/              → Data access (Spring Data JPA)
│   │   ├── model/                   → JPA entities
│   │   ├── dto/                     → Data transfer objects
│   │   └── config/                  → CORS configuration and DataLoader
│   └── pom.xml
│
└── .github/
    └── copilot-instructions.md      → Rabobank code standards for Copilot
```

## Getting started

### Frontend

No installation required. Open `frontend/index.html` via **VS Code Live Server**:

1. Install the **Live Server** extension in VS Code (if not already installed).
2. Click `Go Live` in the status bar.
3. The app is available at `http://localhost:5500` (or `5501`).

> Or double-click directly on `index.html`. Note: ES modules require a server — use Live Server for full functionality.

### Backend

Requirements: **Java 17** and **Maven**.

```bash
cd backend
mvn spring-boot:run   # http://localhost:8080
```

- REST API: `http://localhost:8080/api/v1/cases`
- H2 console page: `http://localhost:8080/h2-console`

## How this connects to the labs

This project is your **sandbox**. Each lab exercise asks you to create or modify files in this project. The existing code gives Copilot context about:

- The domain (banking, customer cases, Dutch financial terms)
- Our conventions (vanilla JS components, Spring Boot patterns)
- The component structure (so Copilot generates consistent code)

**Tip:** Keep related files open in VS Code tabs while doing the labs — Copilot uses open files as context for better suggestions.

## Lab exercise mapping

| Lab | File | Task |
|-----|------|------|
| FE L1 | `js/components/notification.js` | Implement `showNotification` with auto-dismiss |
| FE L2 | `js/components/case-card.js` | Refactor string concatenation to DOM API (XSS-safe) |
| FE L3 | `js/validate.js` (to create) | Write a form validation module |
| FE L4 | `js/components/admin.js` | Fix XSS vulnerabilities in the admin panel |
| FE L5 | `js/utils/formatters.js` | Find and fix three bugs in `calculatePriorityScore` |
| FE L6 | `js/components/case-list.js` | Add debounce and use `DocumentFragment` |
| BE L1 | `controller/CaseController.java` | New REST endpoint for case summary CRUD |
| BE L2 | `.github/copilot-instructions.md` | Create team standards for Copilot |
| BE L3 | Architecture documentation | Generate docs for the case service |
| BE L4 | `service/CaseService.java` | Fix SQL injection in case search function |
| BE L5 | Tests for `CaseService` | Write unit tests with JUnit 5 + Mockito |
| BE L6 | Monthly report generator | Improve the report logic |
