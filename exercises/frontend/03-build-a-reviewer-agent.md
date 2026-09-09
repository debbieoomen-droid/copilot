# 🧪 Exercise 3 — Build a Custom Front-end Reviewer Agent

> **Your track today:** Exercise 3 of 3 — the last one

## 🎯 Learning Objectives
After this exercise you will:
- Understand what a custom GitHub Copilot agent is and when to use one
- Know the structure of an agent definition file (frontmatter + system prompt)
- Build a reusable **ASK-first frontend security reviewer** agent
- See the difference between a plain Copilot review and an agent-driven review

---

## ⏱ Duration
20–25 minutes

---

## 🏦 Context
You are a front-end developer at a bank. Your team reviews UI code that handles
customer data: names, IBANs, case notes. Reviews are inconsistent — some
developers only check styling, others miss XSS vulnerabilities entirely.

Your goal: build a **reusable custom agent** that enforces a structured,
security-first review process every time.

---

## 🧠 What Is a Custom Agent?

A custom agent is a Markdown file that defines:

| Part | Purpose |
|------|---------|
| **Frontmatter** (`---` block) | Metadata: name, description, which tools the agent may use |
| **System prompt** | The persona, rules, and output format the agent must follow |

> Think of it as hiring a specialist reviewer and writing their job description once.

---

## 📂 Step 1 — Create the Agent File

In the **Explorer**, create this folder structure at the root of the folder you opened in VS Code
(`project/frontend/`) — the `agents` folder does not exist yet, so make it:

```
.github/
  agents/
```

Inside `agents/`, create a new file:

```
frontend-reviewer-ask.agent.md
```

Your file path should be:

```
.github/agents/frontend-reviewer-ask.agent.md
```

## ✍️ Step 2 — Frontmatter + System Prompt

Paste this complete file content:

```markdown
---
name: frontend-reviewer-ask
description: ASK-first brutally honest frontend security reviewer for banking UIs (XSS, PII, accessibility)
tools: ["read", "search"]
---

You are a senior frontend reviewer in a high-risk enterprise banking environment.

IMPORTANT:
You must FIRST gather context before reviewing code.

## Step 1 – ASK (mandatory)
Before doing any review, ask 3–5 critical questions to understand:

- What user data flows through this component (names, IBANs, notes)?
- Where does the data come from (user input, API, third-party system)?
- Who uses this UI (internal agents, customers, admins)?
- Are there accessibility requirements (WCAG level)?
- Which framework/conventions does the project follow?

Do NOT review the code yet. Wait for answers if needed.

## Step 2 – ANALYZE
Once you have enough context, read the code carefully and identify risks.

## Step 3 – REVIEW (brutally honest)

Focus on:
- XSS: any innerHTML/insertAdjacentHTML with user data is a critical finding
- PII exposure: unmasked IBANs, names in logs, sensitive data in localStorage
- Accessibility: missing aria attributes, keyboard traps, colour-only signals
- Maintainability: dead code, duplicated logic, inconsistent conventions

## Output format:

### Context understanding
Summarize the situation in 2–3 sentences.

### 🔥 Critical issues
- What is wrong
- Why it is dangerous in a banking UI
- How to fix it (with a code snippet)

### ⚠️ Improvements
Non-critical but important improvements.

### ✅ What is solid
Keep this short.

### 🚀 Next step
What should be fixed first and why.
```

Save the file.

---

## 🧪 Step 3 — Test the Agent

The project already contains a perfect test subject: the admin panel is
deliberately XSS-vulnerable.

### Test A — Without the agent (baseline)

Open `js/components/admin.js` in the editor, make sure the agents dropdown says **Ask**, then:

```
Review this admin.js code
```

Review the output:
- Did Copilot ask any clarifying questions?
- Did it flag every innerHTML usage with user data?
- Did it check for PII exposure and accessibility?
- Was the review structured or scattered?

### Test B — With the agent

Custom agents are **selected**, not `@`-mentioned. (`@` in VS Code chat is reserved for the
built-in participants `@github`, `@terminal` and `@vscode` — typing `@frontend-reviewer-ask` just
sends literal text.)

1. Open the **agents dropdown** in the Chat view — the selector in the chat input that currently
   says *Ask*, *Plan* or *Agent*
2. Choose **frontend-reviewer-ask** from the list
3. Then type:

```
review #admin.js
```

> 🔎 **Not in the list?** Run `/agents` in chat to open the Configure Custom Agents menu and check
> VS Code has picked up your file. Agent names are case-sensitive, and the file must sit in
> `.github/agents/` inside the folder you opened as your workspace.

Answer its questions. Example answers:

```
- This is an internal admin search panel used by Rabobank customer service agents
- Data comes from the case API: customer names, subjects, and masked IBANs —
  but subjects can contain text entered by third-party systems
- Internal users only, but WCAG AA applies to all internal tools
- Vanilla JS ES modules, no framework, CSS custom properties from variables.css
```

Observe the full review output.

---

## 📊 Step 4 — Compare

| Criteria | Without Agent | With Agent |
|----------|--------------|------------|
| Asked clarifying questions first | ❌ | ✅ |
| Found ALL innerHTML/XSS issues | ⚠️ some | ✅ |
| Checked PII (IBAN masking) | ❌ | ✅ |
| Checked accessibility | ❌ | ✅ |
| Structured, prioritized output | ❌ | ✅ |

💬 **Discuss:**
- Why does asking questions *before* reviewing improve the output?
- Which critical issue would have been missed without the banking context?
- When would you use this agent vs. a plain Copilot prompt?

---

## 🚀 Step 5 — Now let Copilot build the next one

You wrote that file by hand on purpose: now you know what is inside one, so you know what to adjust
when an agent misbehaves. From here on, stop typing frontmatter *from scratch* — let Copilot draft it and then adjust.

### 5a — Generate a skill

A **skill** is knowledge, not a persona. You never call it — Copilot reads its description, decides
your task matches, and pulls it in. Make one for something your team already knows:

Switch the agents dropdown to **Agent** mode and send:

```
/create-skill

Create a skill that captures how this project handles user data in the DOM:
never innerHTML with user-supplied values, always textContent for text nodes,
build elements with document.createElement, and mask IBANs in the UI with maskIBAN
from utils/formatters.js.
```

Copilot asks a couple of questions, then writes `.github/skills/<name>/SKILL.md`.

**Open it and look at the `description` line.** That line is not documentation — it is the trigger.
Copilot reads only the name and description to decide whether this skill is relevant, and loads the
body only if it decides yes. Write a vague description and this file will never be used again.

### 5b — Generate an agent

```
/create-agent

Create an agent that reviews vanilla JavaScript in this project for XSS, PII exposure
and accessibility. It must ask me 3 questions about where the data comes from and who
uses the UI before it reviews anything, and report findings as Critical / Improvements /
What is solid.
```

Compare the result with the file you wrote by hand. Same structure, thirty seconds instead of five
minutes — because you already knew what you were looking at.

### 5c — Wire the skill into the agent

There is **no `skills:` field** in agent frontmatter. Copilot decides on its own whether a skill is
relevant, which means it might not. If you want to be sure, say so explicitly — an agent may
reference other files, and yours has the `read` tool:

```markdown
Before you review anything, read
[our DOM safety rules](../skills/dom-safety/SKILL.md)
and apply them to your findings.
```

**Where does that go?** Open the agent file `/create-agent` just wrote, and paste it as the first
line of the system prompt — directly below the closing `---` of the frontmatter. Save.

Adjust the path to the folder name `/create-skill` actually used.

> ℹ️ **No `tools:` line in your generated agent?** That is fine and common — it then has the
> default toolset and can already read files. Only if a `tools:` list *is* present does it need to
> include `read`.

### ▶️ Verify

Pick your generated agent from the dropdown and point it at the vulnerable panel:

```
review #admin.js
```

Then **expand the collapsed summary line** above the answer.

- `SKILL.md` in the references → the link worked; it read your team's rules before judging.
- Not there → check the relative path, and that the agent may `read`.

💬 **Discuss:** two ways to reach a skill. Hoping the description matches is convenient but not
guaranteed. Linking it from the agent is explicit and nearly always works. In a bank, which of
those two would you want your review process to depend on?

---

## ⚡ Bonus Challenge (optional)

- Add a mandatory **📋 Compliance checklist** section to the output format
  (PII masked, no sensitive data in localStorage, aria-labels present)
- Restrict `tools` to `["read"]` only and observe how the analysis changes
- **Build an agent for your own project**: pick a real repo you work on and
  write a reviewer agent for its biggest recurring review pain point

---

## 💬 Takeaway

> "A custom agent is not a smarter prompt — it is a specialist you hire once and deploy everywhere."
