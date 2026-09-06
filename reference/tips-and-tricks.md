# 🛠️ Do It Yourself — Tips, Tricks & Prompt Templates

Everything worth keeping from the GitHub Copilot workshop, in one file.

You don't need the slides — it's all here. Copy the templates, change the bracketed bits, and go.

---

## 📑 Contents

1. [The one idea everything rests on](#1-the-one-idea-everything-rests-on)
2. [The five moves that turn a weak prompt into a strong one](#2-the-five-moves)
3. [Prompt templates you can copy](#3-prompt-templates-you-can-copy)
4. [RCOF — a checklist for any prompt](#4-rcof--a-checklist-for-any-prompt)
5. [The trigger characters](#5-the-trigger-characters)
6. [Ask / Plan / Agent — which one to use](#6-ask--plan--agent)
7. [Making it permanent: instructions, prompts, agents, skills, tools](#7-making-it-permanent)
8. [The verification habit](#8-the-verification-habit)
9. [Banking-specific habits](#9-banking-specific-habits)
10. [What Copilot is bad at](#10-what-copilot-is-bad-at)
11. [Rabobank specifics](#11-rabobank-specifics)
12. [If you only do one thing](#12-if-you-only-do-one-thing)

---

## 1. The one idea everything rests on

> **It doesn't understand — it predicts.**

Copilot generates the most likely next token from patterns it has learned. It has no internal check
that asks *"do I actually know this?"* — so when it doesn't know, it doesn't go quiet. It produces
something that sounds exactly as confident as when it does know.

Two consequences that drive everything else in this document:

- **AI is only as good as the context you provide.** It doesn't hold your codebase in its head — it
  fetches what it thinks is relevant. Your job is making sure the right things land in front of it.
- **Fluent is not the same as correct.** The failure mode isn't obviously-broken code. It's
  plausible code that passes review because it looks finished.

---

## 2. The five moves

This is the entire difference between the two prompts everyone compared in Exercise 1.

| Move | Weak | Strong |
|---|---|---|
| **Give it a role** | *(none)* | "Act as a senior backend developer" |
| **Name the algorithm or approach** | "validate properly" | "using the official elfproef (11-test)" |
| **Spell out the edge cases** | *(hoped for)* | "return false when the input is null or blank" |
| **Define the return value** | *(implied)* | "valid when the sum is divisible by 11" |
| **Ask for tests** | *(none)* | "include 3 test cases: two valid BSNs, one that fails the elfproef" |

None of it is clever. It's being specific about things you already knew.

**The same five moves work on any task, in any language.** They aren't a BSN trick.

---

## 3. Prompt templates you can copy

### 3.1 The general structure

Good for almost anything. Delete the lines you don't need.

```
Context: [language / framework / where this runs]

Problem:
Expected: [what it should do]
Actual:   [what it does now]

Code:
[paste the snippet]

Task:
Fix the bug while preserving the current architecture.
Explain the root cause and provide the corrected code.
Consider edge cases and update the tests.
```

### 3.2 Feature request

```
Add [feature] to [file].

It should [specific behaviour].
Follow our existing pattern in [similar file].
Consider [edge cases].
Update tests in [test file].
```

> 💡 `Follow our existing pattern in [similar file]` is worth more than any adjective you could add.
> It points at the convention instead of trying to describe it.

### 3.3 Bug fix

```
This function [name] should [expected behaviour], but currently [actual behaviour].

The error is [error message].
The function is used by [X, Y, Z].

Fix it while maintaining [constraints].
```

> 💡 `The function is used by [X, Y, Z]` tells it what it must not break. Most bad fixes aren't
> wrong in isolation — they're wrong in context.

### 3.4 Make it ask you first

The highest-value trick in the whole session, and it costs nothing.

```
Act as a senior software engineer.

Before writing any code, ask me the 5 most important questions that would reduce
mistakes and missing context in the solution.

Focus on:
- requirements
- architecture
- environment
- constraints
- edge cases

Only after I answer the questions, generate the code.
```

Two things happen: the output improves, and **you find out what you hadn't thought about.** The
questions are often more useful than the code.

### 3.5 The golden prompt — get it to write your prompt

```
Act as a prompt engineer.

Generate a high-quality prompt to [describe your task] for a Rabobank use case.

Before generating the final prompt, ask me 5 relevant questions to better
understand the requirements and context.
```

> ⚠️ **Context gathering always improves results — but only if you explicitly trigger it.**
> Copilot will not go looking on its own initiative.

### 3.6 Understand a codebase you've never seen

Run these one at a time in **Ask** mode, in the folder you've opened. Then check what it read
(see [section 8](#8-the-verification-habit)).

```
#codebase Explain the architecture of this project. Which layers exist, and how does a request flow through them?
```

```
#codebase Where do the business rules live? Which class or module decides [the thing you care about]?
```

```
#codebase Where is [sensitive data] handled, and why is it done in that layer rather than another?
```

This is the biggest real time-saver Copilot offers most developers: orientation in a strange
codebase in two minutes instead of half an hour.

### 3.7 Write your team's instructions file

See [section 12](#12-if-you-only-do-one-thing). Run this in the repo you actually work in:

```
#codebase Read this project and draft a .github/copilot-instructions.md that captures
how we actually write code here: language and framework versions, folder structure,
naming conventions, error handling, testing approach, and any security rules that apply.

Only state conventions you can see evidence of in the code. Where you are unsure,
list it as an open question instead of guessing.
```

> ⚠️ That last paragraph matters. Without it you get a confident file full of conventions your team
> never agreed to. Then **edit it by hand** — the draft is a starting point, not the answer.

---

## 4. RCOF — a checklist for any prompt

Four questions to run through before you hit enter. Weak prompts skip most of them.

| Letter | Question | Example |
|---|---|---|
| **R** — Role | Who should Copilot act as? | "Act as a senior backend developer" |
| **C** — Context | What project, file or constraint applies? | "This is a banking app — XSS is critical" |
| **O** — Output | What exactly should come back? | "A production-ready ES module with JSDoc" |
| **F** — Format | What rules must the code follow? | "Use the DOM API, never innerHTML with user data" |

---

## 5. The trigger characters

| Type | Picks | Examples |
|---|---|---|
| `@` | **Who** you're talking to (built-in participants only) | `@github`, `@terminal`, `@vscode` |
| `#` | **What** it should look at | `#codebase`, `#selection`, `#changes`, `#problems`, `#<filename>` |
| `/` | **A ready-made task** | `/explain`, `/fix`, `/tests`, `/doc`, `/plan`, `/agents` |

**The one to remember is `#codebase`** — "search my whole project before answering".

> ⚠️ `@workspace` is the old name for `#codebase`. If you see it in older blog posts or material,
> that's what it means.
>
> ⚠️ **`@` does not call your custom agents.** See [section 7](#7-making-it-permanent).

You can also press **+ (Add Context)** in the chat box, or drag a file onto the chat panel.

---

## 6. Ask / Plan / Agent

Chosen from the **agents dropdown** in the chat input.

| Mode | Touches your files? | Use it when |
|---|---|---|
| **Ask** | No | Understanding code, asking questions, exploring. Safest — start here. |
| **Plan** | No | You want it to research the task and write an implementation plan before any code exists. |
| **Agent** | **Yes** | You want it to do the work — edit files, run commands, fix its own errors. |

> **Edit mode was removed** from VS Code in June 2026. Use Agent instead. If you still see Edit,
> Agent mode has been disabled by policy on your machine.

**Underrated:** most people jump straight to Agent and then review a large diff. Reviewing a *plan*
is much easier than reviewing the code that plan would have produced — and disagreeing costs you
nothing at that stage.

---

## 7. Making it permanent

Five things that sound interchangeable. The difference is **who decides to use it.**

| Thing | Lives in | Who triggers it | What it is |
|---|---|---|---|
| **Instructions** | `.github/copilot-instructions.md` | **Nobody — always on** | House rules, silently added to every request in this repo |
| **Path instructions** | `.github/instructions/*.instructions.md` | Nobody — on for matching files | The same, scoped to a folder or file pattern |
| **Prompts** | `.github/prompts/*.prompt.md` | **You**, by typing `/name` | A saved prompt — your own `/explain` |
| **Agents** | `.github/agents/*.agent.md` | **You**, by picking it from the agents dropdown | A persona: how to work, what to check, what format to answer in |
| **Skills** | `.github/skills/<name>/SKILL.md` | **Copilot itself**, when the task matches | A knowledge pack it reaches for on its own. You never call it |
| **Tools** | a `tools:` list *inside* an agent | The agent, while working | What that agent is *allowed* to do: read, search, edit, run |

**Think of it as hiring.** Instructions are the company handbook everyone follows without being
told. A prompt is a form you fill in. An agent is a specialist you call in by name. A skill is the
manual on the shelf the specialist picks up when they need it. Tools are what you let them touch.

> 🔑 **Copilot reads these from the folder you opened in VS Code.** Open the wrong folder and none
> of them load — silently, with no warning.

> ⚠️ **Custom agents are selected from the agents dropdown, not `@`-mentioned.** Typing
> `@my-agent-name` just sends literal text. Run `/agents` in chat to see what VS Code has picked up.

### A minimal agent to start from

```markdown
---
name: my-reviewer
description: Reviews code the way our team reviews it
tools: ["read", "search"]
---

You are a senior reviewer on a [your domain] team.

Before reviewing, ask 3–5 questions to understand:
- what this code does and where it runs
- who uses it and what data flows through it
- any constraints I should know about

Then review for: [the things your team always comments on].

Output format:
### Critical issues
### Improvements
### What is solid
### What to fix first
```

`tools: ["read", "search"]` keeps it read-only — it can review, never edit.

### How to actually use it once you've saved it

1. Save the file as `.github/agents/my-reviewer.agent.md`, **inside the folder you opened in VS Code**
2. Open the **agents dropdown** in the Chat view — the same selector that says *Ask*, *Plan* or *Agent*
3. Pick **my-reviewer** from the list
4. Now type your request normally, attaching the file you want looked at:

```
review #PaymentService.java
```

> ⚠️ **Do not type `@my-reviewer`.** That is not how custom agents work — `@` is reserved for the
> built-in participants (`@github`, `@terminal`, `@vscode`), so `@my-reviewer` is just sent as
> literal text and nothing happens.

**Not in the dropdown?** Check three things: the file is in `.github/agents/` *inside the folder you
opened* (not the repository root), it ends in `.agent.md`, and the frontmatter has a `name:`.
Typing `/agents` in chat opens the Configure Custom Agents menu and shows what VS Code has found.

Once it's committed, everyone who clones that repository has the same reviewer.

### You don't have to write these by hand

We built the agent manually in the exercise on purpose — once you have seen what is inside one,
you know what to adjust when it misbehaves. But from now on, let Copilot do the typing.

| What you want | Ask Copilot to make it | Command Palette | Click path |
|---|---|---|---|
| An **agent** | `/create-agent` *(needs Agent mode)* | `Chat: New Custom Agent` | gear icon → **Agents** → New Agent |
| A **prompt file** | `/create-prompt` | `Chat: New Prompt File` | gear icon → **Prompts** → New Prompt |
| An **instructions file** | `/create-instruction` | `Chat: New Instructions File` | gear icon → **Instructions** → New Instructions |

Each of the `/create-…` commands asks you a few clarifying questions first, then writes the file
in the right place with the right frontmatter.

### `/init` — the one to run today

In your own repository, type this in chat:

```
/init
```

Copilot reads your project and drafts a `.github/copilot-instructions.md` based on what is
actually there: your stack, your conventions, your folder layout. It is not an empty template —
it is a first draft you only have to correct.

**This is the highest-value twenty minutes in this whole document.** Do it once for the repo you
open every day, and from then on every prompt anyone on your team writes already has your
standards loaded.

### Workspace or User — decide where it lives

Every one of these can be saved in two places, and the choice matters:

| | Lives in | Who gets it |
|---|---|---|
| **Workspace** | `.github/…` in the repo | Everyone who clones it — use this for team standards |
| **User** | your own profile (`~/.copilot/agents`, and the equivalent for prompts and instructions) | Only you, but in **every** project you open |

A reviewer that matches your team's conventions belongs in the workspace. Your own personal way of
reviewing belongs in your user profile — write it once and you have it for the rest of your career.

> 💡 VS Code also reads `.claude/agents/` and `CLAUDE.md`. If you or a colleague already built
> something for another AI coding tool, those files work here too.

---

## 8. The verification habit

The single habit worth taking home.

After any answer that matters, **expand the collapsed summary line above it** — depending on your
VS Code version it says *"Used N references"*, *"Searched codebase"*, or shows the tool calls it
made. Then ask:

1. **Did it read the files you would have read?**
2. **Open one.** Is the explanation actually true?
3. **Did it state anything it could not have known from the code?** — a business reason, an SLA,
   why a decision was made.

If it didn't read the file that decides the answer, the answer is a guess wearing a confident face.

### Three specific traps

- **Generated tests prove very little.** If Copilot wrote both the code and the tests, a passing
  suite proves they agree with each other — not that either is right. Delete the thing a test claims
  to protect and check the test actually goes red.
- **A refactor that looks safe isn't proven safe.** If you asked it to close a security hole, go and
  attack the code again afterwards.
- **Wrong documentation is worse than none**, because it gets believed. Comments don't fail tests.

---

## 9. Banking-specific habits

- **Never paste real customer data, credentials, tokens or production config into a prompt.** Use
  the shape of the data, not the data.
- **Say the domain out loud in the prompt.** "This is a banking application, reliability matters"
  measurably changes what comes back.
- **Name your compliance constraints** — PII masking, audit trails, no sensitive data in exception
  messages or logs. It won't infer them.
- **Be specific about money and identifiers.** Rounding, currency handling, IBAN validation and
  idempotency are exactly where plausible-looking code goes wrong quietly.
- **Ask it what it changed, not just for the change.** On anything touching a payment or a balance,
  make it explain the consequences.

---

## 10. What Copilot is bad at

- **Whole features.** Ask for part of one. Small, specific changes.
- **Knowing your codebase up front.** It fetches; it doesn't remember.
- **Knowing anything internal** — your services, your rate limits, why that workaround exists. It
  will invent a plausible answer rather than say "I don't know".
- **Saying "I don't know".** There is no such switch.
- **Consistency.** It's non-deterministic. The same prompt twice gives you two answers, and that's
  expected, not a bug.

> It's a powerful assistant — not a replacement for engineering judgment. **You stay the pilot.**

---

## 11. Rabobank specifics

- **OpenAI models only.** Pick a GPT-5 model from the dropdown, or leave it on **Auto**.
- **Licences are deactivated every 3 months.** Re-activate before you need it, not during.
- **Hooks are not permitted** — so `.github/hooks/` is out, even though you'll see it in general
  Copilot documentation.
- **Public MCP servers are blocked**, and MCP is a separate training.
- **Code completions are unlimited** on paid plans and are not billed against AI credits.

---

## 12. If you only do one thing

**Write `.github/copilot-instructions.md` for the repository you work in every day.**

The fastest route: open that repository and type **`/init`** in Copilot Chat. It reads your project
and drafts the file from what is actually there. Then edit it by hand — that part is still yours.
Prefer to steer it yourself? Use the prompt in
[section 3.7](#37-write-your-teams-instructions-file) instead.

It costs twenty minutes, once — and with `/init`, closer to five. After that, every prompt anyone on your team writes already has your
standards loaded. That is the difference between a tool you use and a tool your team has configured.

**And then the second one:** think of the review comment you leave on pull requests over and over.
Write it down once as an agent ([section 7](#7-making-it-permanent)). You already know how.

---

## 📚 See also

- [`copilot-cheatsheet.md`](copilot-cheatsheet.md) — the commands, in brief
- [`handy-websites.md`](handy-websites.md) — official docs and ready-made agents/skills
- [`copilot-customization-guide.html`](copilot-customization-guide.html) — a longer guide to customization
- [`../labs.html`](../labs.html) — every exercise, including the ones we didn't reach
