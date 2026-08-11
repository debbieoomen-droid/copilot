# 🧪 Exercise 3 — Build a Custom Frontend Reviewer Agent in VS Code

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

In the project root, create:

```
.github/agents/frontend-reviewer-ask.md
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

Open `project/frontend/js/components/admin.js`, then ask Copilot Chat:

```
Review this admin.js code
```

Review the output:
- Did Copilot ask any clarifying questions?
- Did it flag every innerHTML usage with user data?
- Did it check for PII exposure and accessibility?
- Was the review structured or scattered?

### Test B — With the agent

Invoke your agent:

```
@frontend-reviewer-ask review admin.js
```

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

## ⚡ Bonus Challenge (optional)

- Add a mandatory **📋 Compliance checklist** section to the output format
  (PII masked, no sensitive data in localStorage, aria-labels present)
- Restrict `tools` to `["read"]` only and observe how the analysis changes
- **Build an agent for your own project**: pick a real repo you work on and
  write a reviewer agent for its biggest recurring review pain point

---

## 💬 Takeaway

> "A custom agent is not a smarter prompt — it is a specialist you hire once and deploy everywhere."
