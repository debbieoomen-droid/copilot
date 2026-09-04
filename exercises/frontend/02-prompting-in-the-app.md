# 🧪 Exercise 2 — Prompting in the App

> **Your track today:** Exercise 2 of 3 · next up is `exercises/frontend/03`

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
1. In VS Code choose **File → Open Folder** and open `project/frontend/`
   *(not the repository root — Copilot only reads `.github/copilot-instructions.md` from the
   folder you open, and the Rabobank frontend standards live in `project/frontend/.github/`)*
2. Right-click `index.html` → **Open with Live Server**
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

## 🧭 Step 0 — Understand the codebase before you change it (8 min)

**Do this first. You are about to modify an app you have never seen.**

Normally that means half an hour of clicking through folders. Instead, ask.

With `project/frontend/` open, open Copilot Chat in **Ask** mode and send these one at a time:

```
#codebase Explain how this frontend is structured. Which file owns what, and how do the components fit together?
```

```
#codebase How does data get from the API layer to what the user actually sees on screen?
```

```
#codebase What is the difference between mock mode and real backend mode, and where is that switched?
```

### 👉 Now the part that matters

After each answer, **expand the collapsed summary line above it** — depending on your VS Code
version it reads *"Used N references"*, *"Searched codebase"* or shows the tool calls it made —
and check which files Copilot actually read.

- Did it read the files you would have read?
- Open one of them. Is the explanation actually true?
- Did it state anything confidently that it could not have known from the code?

💬 **Discuss:** you just got orientated in a strange codebase in a couple of minutes instead of half
an hour. That is the single biggest time saving Copilot offers most developers — and it is only
worth anything if you spot-check it. An architecture explanation you trust blindly is worse than
no explanation, because now you are confidently wrong.

---

## 🧩 Scenario A — Implement a UI Component (Lab 1)

**File:** `js/components/notification.js`

The `showNotification()` function is an empty stub. The app already calls it everywhere, but nothing appears on screen.

### 📂 Context setup — open these tabs first
- `js/components/notification.js`
- `index.html`
- `css/styles.css`
- `css/variables.css`

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
- Do not write new CSS: .notification already animates itself in via the notif-in keyframes in css/styles.css
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

### ▶️ Step A4 — Prove it actually works

Reviewing the code is not the same as knowing it runs. Go and see:

1. Save `notification.js` and reload the app in the browser
2. Open any case and **change its status** in the dropdown
3. A green success banner should appear top-right and disappear after ~4 seconds
4. Trigger another one straight away — do two banners **stack**, or overlap?

Then try the thing the prompt was really about:

5. Open `js/data.js`, and in any case change `customerName` to:
   `<img src=x onerror="alert('XSS')">`
6. Reload, change that case's status, and read the banner

If your implementation used `textContent`, the banner shows that text literally. If it used
`innerHTML`, you get a popup — which in production would be someone else's script running inside
a Rabobank tool.

> 🧹 Undo the change to `data.js` before moving on.

💬 **Discuss:** Copilot's weak-prompt version probably looked fine on screen. Which of these two
told you the truth — reading it, or running it?

---

## 🧩 Scenario B — Security Refactoring (Lab 2 + Lab 4)

**File:** `js/components/case-card.js`

`renderCaseCard` builds HTML using string concatenation and `innerHTML`. In a banking app this is an XSS risk because customer names and subjects are user-generated data.

### 📂 Context setup — open these tabs first
- `js/components/case-card.js`
- `js/utils/formatters.js`
- `css/styles.css`

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

### ▶️ Step B4 — Prove the hole is actually closed

A refactor that *looks* safe and a refactor that *is* safe are different things. Attack your own code:

1. **Before you apply Copilot's fix**, open `js/data.js` and change any case's `subject` to:

   ```
   <img src=x onerror="alert('XSS')">
   ```

2. Reload the app. The case list shows a popup — that is the vulnerability firing. Dismiss it.
3. Now apply the refactored `renderCaseCard` from Step B2 and reload again.
4. The card should display that payload **as literal text**. No popup.

> 🧹 Undo the change to `data.js` before moving on.

If you still get a popup, the refactor missed a sink — find which value is still going through
`innerHTML`.

💬 **Discuss:** you have just done the thing that separates a fix from a claimed fix. Copilot told
you it was XSS-safe in Step B2. Only step 4 established that it was.

---

## 🧩 Scenario C — Bug Detection (Lab 5)

**File:** `js/utils/formatters.js` — the `calculatePriorityScore` function

This function contains **three intentional bugs**. Priority scores determine which customer cases are shown first. A bug here could hide a critical fraud report.

### 📂 Context setup — open these tabs first
- `js/utils/formatters.js`

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
1. Arithmetic edge cases — what does this return for a case opened today,
   and is that the right answer for a critical case?
2. Logic errors in conditional branches — check every priority level against
   the factor lookup table
3. Cases where the escalation bonus is applied incorrectly — compare the
   condition in the code against the behaviour described in the doc comment

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

### ▶️ Step C4 — Watch the bug in the actual app

`renderCaseList` sorts the sidebar by this score, so these bugs are visible on screen.

**Before fixing anything**, reload the app and look at the bottom of the case list. The case
marked **critical** is sitting *last* — below every low-priority case. That is bug 3: `critical`
is missing from the factor table, so it scores 0.

Now apply your fixes and reload:

- The critical case should jump to the **top** of the list
- **Resolved** and **closed** cases should stop collecting the +10 escalation bonus, so they drift
  down the list

The third fix — a case opened **today** scoring 0 regardless of priority — can't be seen in the
sidebar, because none of the seeded cases were created today. Prove that one in the console
instead:

```js
calculatePriorityScore({ priority: 'critical', status: 'open', createdAt: new Date().toISOString() })
```

Before your fix this returns `0`. After it, a brand-new critical case should outrank an old
low-priority one.

Add the `console.assert()` lines Copilot gave you to the bottom of `formatters.js`, reload, and
check the browser console (<kbd>F12</kbd>) — silent means passing.

> 🧹 Remove the assert lines again before moving on.

💬 **Discuss:** How does describing the real-world risk ("fraud case ranked as low priority")
change the quality of the suggestions? And note what just happened: a scoring bug nobody could
see in the code was obvious the moment the app ran.

---

## 🧩 Scenario D — Documentation & Onboarding (Lab 3)

### 🏦 Scenario
A new front-end developer joins the team next week. The code works, but almost none of it is documented — which makes onboarding slow and reviews harder.

### 📂 Context setup — open these tabs first
- `js/utils/formatters.js`
- `js/api.js`

### Step D1 — Weak Prompt

```
add comments
```

Review the output: are the comments useful, or do they just restate what the code obviously does?

### Step D2 — Strong Prompt

```
Act as a senior front-end developer at Rabobank writing documentation for a new joiner.

Add JSDoc comments to the exported functions in formatters.js.

For each function include:
- A one-line summary of what it does and WHY it exists in a banking context
- @param with type and meaning (not just the type)
- @returns with an example value
- A @example line showing realistic Dutch banking input (IBAN, EUR amount, or nl-NL date)

Rules:
- Do not change any logic — comments only
- Flag any function whose behaviour is unclear or surprising rather than guessing
- Keep each comment under 6 lines
```

### Step D3 — Compare

| Criteria | Weak Prompt | Strong Prompt |
|----------|------------|---------------|
| Explains *why*, not just *what* | ❌ | ✅ |
| Realistic banking examples | ❌ | ✅ |
| Flags unclear behaviour instead of inventing it | ❌ | ✅ |
| Useful to someone on day one | ❌ | ✅ |

💬 **Discuss:**
- Which comments would actually help a new joiner, and which are noise?
- Copilot documents what the code *does* — but can it document what the code *should* do? Who owns that?
- Where would you NOT want AI-generated documentation?

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
- Unit test structure (vitest — run `npm install` once in `project/frontend/` first)  

---

## 💬 Takeaway

> “Better prompts don’t just ask — they define role, context, and expectations.”