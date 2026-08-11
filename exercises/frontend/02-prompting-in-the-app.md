# 🧪 Exercise 1 — Effective Prompting for Rabobank Front-end Developers

## 🎯 Learning Objectives
After this exercise you will:
- Know the difference between a weak prompt and a strong one
- Use the **RCOF framework** (Role · Context · Output · Format) to structure every prompt
- Understand how the files you have **open in VS Code** directly influence Copilot's suggestions
- Apply frontend-specific constraints: DOM API, XSS safety, accessibility, CSS custom properties
- Evaluate Copilot output through a banking security lens

---

## ⏱ Duration
20–25 minutes

---

## 🏦 Context
You are a front-end developer at Rabobank working on the **Customer Case Summary** tool — a
Vanilla JS/CSS application used by internal customer-service agents.

Open the project now:
1. Open `project/` in VS Code
2. Start **Live Server** on `frontend/index.html`
3. Verify the app loads at http://localhost:5500

---

## 🔑 The RCOF Prompt Framework

Before writing any Copilot prompt, ask yourself four questions:

| Letter | Question | Example |
|--------|----------|---------|
| **R** — Role | Who should Copilot act as? | "Act as a senior frontend developer" |
| **C** — Context | What project/file/constraint applies? | "This is a banking app — XSS is critical" |
| **O** — Output | What exactly should be returned? | "Return a production-ready ES module with JSDoc" |
| **F** — Format | What rules must the code follow? | "Use the DOM API, never innerHTML with user data" |

Weak prompts skip most of these. Strong prompts cover all four.

---

## 📂 Context Tip: Open Files = Better Suggestions

GitHub Copilot reads every file you have open as a tab in VS Code.

> **Always open related files before prompting.**

For each scenario below, a "Context setup" section tells you which files to open first.

---

## 🧩 Scenario A — Implement a UI Component (Lab 1)

**File:** `frontend/js/components/notification.js`

The `showNotification()` function is an empty stub. The app already calls it everywhere, but nothing appears on screen.

### 📂 Context setup — open these tabs first
- `frontend/js/components/notification.js`
- `frontend/index.html`
- `frontend/css/styles.css`
- `frontend/css/variables.css`

### Step A1 — Weak Prompt

Open Copilot Chat and type:

```
Implement showNotification
```

Take 2 minutes to review the output:
- Does it use the existing CSS classes from `styles.css`?
- Does it attach the banner to `#notification-area` from `index.html`?
- Is `innerHTML` used with user-supplied data?
- Does it auto-dismiss?

### Step A2 — Strong Prompt (RCOF)

Now use this structured prompt:

```
Act as a senior front-end developer at Rabobank.

Implement the showNotification(message, type) function in notification.js.

Requirements:
- Use the DOM API only (createElement, textContent) — never innerHTML with user data
- Append the banner <div> to #notification-area (already in index.html)
- Apply CSS classes: .notification and .notification--{type}
  (types: success | error | warning | info — already in styles.css)
- Auto-dismiss after 4 seconds for 'success' and 'info' types
- Add a close (×) button that dismisses the banner immediately
- Animate in with a CSS slide-down transition (use the .notification--visible class)
- Handle multiple queued notifications without overlap

Context:
This tool is used by Rabobank agents to handle customer cases. Notifications can
contain customer names. innerHTML with user data would be an XSS vulnerability.

Output:
A clean ES module export — no framework, no dependencies. Add JSDoc on the exported function.
```

### Step A3 — Compare

| Criteria | Weak Prompt | Strong Prompt |
|----------|------------|---------------|
| Uses existing CSS classes | ❌ | ✅ |
| Attaches to correct DOM element | ❌ | ✅ |
| XSS-safe (no innerHTML with data) | ❌ | ✅ |
| Auto-dismiss implemented | ⚠️ | ✅ |
| Close button present | ❌ | ✅ |
| Production-ready with JSDoc | ❌ | ✅ |

💬 **Discuss:** Which part of the strong prompt made the biggest difference?

---

## 🧩 Scenario B — Security Refactoring (Lab 2 + Lab 4)

**File:** `frontend/js/components/case-card.js`

`renderCaseCard` builds HTML using string concatenation and `innerHTML`. In a banking app this is an XSS risk because customer names and subjects are user-generated data.

### 📂 Context setup — open these tabs first
- `frontend/js/components/case-card.js`
- `frontend/js/utils/formatters.js`
- `frontend/css/styles.css`

### Step B1 — Weak Prompt

```
Refactor this component
```

Review the output:
- Did Copilot remove `innerHTML`?
- Did it use `textContent` for every piece of user data?
- Did it keep the same CSS class names?

### Step B2 — Strong Prompt (RCOF)

```
Act as a senior frontend security engineer reviewing Rabobank banking software.

Refactor the renderCaseCard function in case-card.js.

Problem:
The function uses string concatenation with innerHTML to build card markup.
This is a critical XSS vulnerability — customer names and subjects are user data.

Requirements:
1. Replace string concatenation with template literals (intermediate step)
2. Then replace innerHTML entirely with DOM API:
   - document.createElement for every element
   - element.textContent for ALL user-supplied values (id, customerName, subject, priority)
   - Keep all existing CSS class names (case-card, case-card__header, badge, etc.)
3. Add an aria-label attribute to the root card element for screen-reader accessibility
4. Keep the priorityIcon helper function unchanged

Context:
This is a regulated banking environment. A customer's subject line could contain
HTML or script tags if inserted via a third-party system.
The CSS classes are defined in styles.css.

Output:
Refactored ES module. Add a short comment above each textContent call
explaining why it is XSS-safe (e.g. "// textContent never interprets HTML").
```

### Step B3 — Compare

| Criteria | Weak Prompt | Strong Prompt |
|----------|------------|---------------|
| Removes innerHTML with user data | ❌ | ✅ |
| Uses textContent for all user values | ❌ | ✅ |
| Preserves existing CSS class names | ⚠️ | ✅ |
| Adds accessible aria-label | ❌ | ✅ |
| Explains the XSS risk in comments | ❌ | ✅ |

💬 **Discuss:** What would happen if a malicious case subject contained `<script>` tags with the original code?

---

## 🧩 Scenario C — Bug Detection (Lab 5)

**File:** `frontend/js/utils/formatters.js` — the `calculatePriorityScore` function

This function contains **three intentional bugs**. Priority scores determine which customer cases are shown first. A bug here could hide a critical fraud report.

### 📂 Context setup — open these tabs first
- `frontend/js/utils/formatters.js`

### Step C1 — Weak Prompt

```
Are there bugs in calculatePriorityScore?
```

Review the output:
- Did Copilot find all three bugs?
- Did it explain what each bug causes in practice?
- Did it provide a test for each?

### Step C2 — Strong Prompt (RCOF)

```
Act as a QA engineer auditing a Rabobank case management dashboard.

Analyse the calculatePriorityScore function in formatters.js.

Review specifically for:
1. Division or arithmetic errors (especially with zero-value inputs like daysOpen = 0)
2. Logic errors in conditional branches — check every priority factor mapping
3. Cases where bonus conditions are applied incorrectly
   (e.g. resolved/closed cases that should not receive an escalation bonus)

For each bug you find, provide:
- BUG: a one-sentence description
- LOCATION: the exact line or condition
- BROKEN INPUT: a concrete input that triggers the bug
- IMPACT: what happens in the Rabobank app (e.g. fraud case ranked as low priority)
- FIX: the corrected code snippet
- TEST: one console.assert() that catches this bug

Context:
Priority scores are used to automatically sort Rabobank customer cases in the
case list sidebar. Incorrect scores directly affect which cases agents handle first.
A resolved fraud case receiving a high score would waste agent time.

Output:
Structured list, one block per bug.
```

### Step C3 — Compare

| Criteria | Weak Prompt | Strong Prompt |
|----------|------------|---------------|
| Finds all three bugs | ⚠️ | ✅ |
| Explains real-world impact | ❌ | ✅ |
| Provides testable assertions | ❌ | ✅ |
| Gives domain context (fraud, priority) | ❌ | ✅ |
| Structured, actionable output | ❌ | ✅ |

💬 **Discuss:** How does describing the real-world risk ("fraud case ranked as low priority") change the quality of the suggestions?

---

## 🔒 Banking-Specific Prompt Habits

Use this checklist when prompting for any Rabobank front-end code:

| Habit | Why it matters |
|-------|---------------|
| "Use the DOM API — never innerHTML with user data" | Prevents XSS in customer-facing fields |
| "Mask IBAN using maskIBAN from formatters.js" | Prevents PII exposure in the UI |
| "No sensitive data in localStorage" | Tokens, IBANs, and BSNs must not be persisted client-side |
| "Add aria-label to all interactive elements" | Accessibility is a Rabobank standard |
| "Use CSS custom properties from variables.css" | Keeps the design system consistent |
| "Export as a named ES module export" | Matches the project module convention |

---

## 🧠 Key Takeaways

1. **More open files = better context** — before prompting, open the files Copilot needs to see
2. **RCOF = Role · Context · Output · Format** — all four improve output quality significantly
3. **Name the risk** — saying "this is an XSS vulnerability in a banking app" produces safer code than just "refactor"
4. **Be explicit about what NOT to do** — "never innerHTML with user data" is more effective than "be safe"
5. **You are not prompting a tool — you are briefing a developer**

---

## ➡️ Next Steps

These scenarios map directly to the hands-on labs in `project/README.md`:

| Scenario | Lab | File |
|----------|-----|------|
| A — Notification Banner | FE Lab 1 | `js/components/notification.js` |
| B — XSS Refactoring | FE Lab 2 + FE Lab 4 | `js/components/case-card.js`, `js/components/admin.js` |
| C — Bug Detection | FE Lab 5 | `js/utils/formatters.js` |

---

## ⚡ Bonus Challenge (optional)

Enhance your prompt even further.

Try adding:
- Country-specific IBAN validation rules  
- Error messages instead of just true/false  
- Logging for invalid cases  
- Unit test structure (vitest — already configured in this project)  

---

## 💬 Takeaway

> “Better prompts don’t just ask — they define role, context, and expectations.”