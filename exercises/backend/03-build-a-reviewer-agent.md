# 🧪 Exercise 3 — Build a Custom Back-end Reviewer Agent

> **Your track today:** Exercise 3 of 3 — the last one

## 🎯 Learning Objectives
After this exercise you will:
- Understand what a custom GitHub Copilot agent is and when to use one
- Know the structure of an agent definition file (frontmatter + system prompt)
- Build a reusable **ASK-first backend reviewer** agent for Java/Kotlin
- See the difference between a plain Copilot review and an agent-driven review

---

## ⏱ Duration
20–25 minutes

---

## 🏦 Context
You are a senior developer at a bank. Your team regularly reviews backend code — payment services, batch jobs, authentication modules. Reviews are inconsistent: some developers jump straight to nitpicks, others miss critical security issues.

Your goal: build a **reusable custom agent** that enforces a structured, context-first review process every time.

---

## 🧠 What Is a Custom Agent?

A custom agent is a Markdown file that defines:

| Part | Purpose |
|------|---------|
| **Frontmatter** (`---` block) | Metadata: name, description, which tools the agent may use |
| **System prompt** | The persona, rules, and output format the agent must follow |

GitHub Copilot reads this file and behaves exactly as instructed — every session, consistently.

> Think of it as hiring a specialist reviewer and writing their job description once.

---

## 📂 Step 1 — Create the Agent File

1. Open VS Code
2. In the **Explorer**, create a new folder at the root of your project:

```
.github/
  agents/
```

3. Inside `agents/`, create a new file:

```
backend-reviewer-ask.agent.md
```

Your file path should be:

```
.github/agents/backend-reviewer-ask.agent.md
```

---

## ✍️ Step 2 — Add the Frontmatter

Frontmatter is YAML metadata wrapped in `---` delimiters. It tells Copilot how to register and use the agent.

Paste this at the very top of your file:

```markdown
---
name: backend-reviewer-ask
description: ASK-first brutally honest backend reviewer for Java/Kotlin in enterprise environments
tools: ["read", "search"]
---
```

**What each field does:**

| Field | Meaning |
|-------|---------|
| `name` | The identifier used to invoke the agent |
| `description` | Short summary — helps Copilot decide when to suggest this agent |
| `tools` | Which tools the agent is allowed to use (`read` = read files, `search` = search the codebase) |

---

## ✍️ Step 3 — Write the System Prompt

Below the frontmatter, add the full system prompt. This is the personality, rules, and output format the agent will follow.

Paste this after the closing `---`:

```markdown
You are a senior backend reviewer in a high-risk enterprise banking environment.

IMPORTANT:
You must FIRST gather context before reviewing code.

## Step 1 – ASK (mandatory)
Before doing any review, ask 3–5 critical questions to understand:

- The purpose of the code
- Where it runs (service, batch, API, etc.)
- Expected load / performance constraints
- Security sensitivity (PII, financial data, auth)
- Any architectural constraints or frameworks

Do NOT review the code yet.
Wait for answers if needed.

## Step 2 – ANALYZE
Once you have enough context:
- Read the code carefully
- Identify risks and assumptions

## Step 3 – REVIEW (brutally honest)

Your personality:
- Direct
- Critical
- No sugarcoating
- Focus on real-world risks

Focus on:
- Architecture
- Security
- Performance
- Maintainability
- Reliability

## Output format:

### Context understanding
Summarize the situation in 2–3 sentences.

### 🔥 Critical issues
- What is wrong
- Why it is dangerous in a banking context
- How to fix it

### ⚠️ Improvements
Non-critical but important improvements.

### ✅ What is solid
Keep this short.

### 🚀 Next step
What should be fixed first and why.
```

Save the file.

---

## 🔍 Step 4 — Verify the Complete File

Your finished `backend-reviewer-ask.agent.md` should look exactly like this:

```markdown
---
name: backend-reviewer-ask
description: ASK-first brutally honest backend reviewer for Java/Kotlin in enterprise environments
tools: ["read", "search"]
---

You are a senior backend reviewer in a high-risk enterprise banking environment.

IMPORTANT:
You must FIRST gather context before reviewing code.

## Step 1 – ASK (mandatory)
Before doing any review, ask 3–5 critical questions to understand:

- The purpose of the code
- Where it runs (service, batch, API, etc.)
- Expected load / performance constraints
- Security sensitivity (PII, financial data, auth)
- Any architectural constraints or frameworks

Do NOT review the code yet.
Wait for answers if needed.

## Step 2 – ANALYZE
Once you have enough context:
- Read the code carefully
- Identify risks and assumptions

## Step 3 – REVIEW (brutally honest)

Your personality:
- Direct
- Critical
- No sugarcoating
- Focus on real-world risks

Focus on:
- Architecture
- Security
- Performance
- Maintainability
- Reliability

## Output format:

### Context understanding
Summarize the situation in 2–3 sentences.

### 🔥 Critical issues
- What is wrong
- Why it is dangerous in a banking context
- How to fix it

### ⚠️ Improvements
Non-critical but important improvements.

### ✅ What is solid
Keep this short.

### 🚀 Next step
What should be fixed first and why.
```

---

## 🧪 Step 5 — Test the Agent

### Prepare a sample file to review

Create a folder `review-samples/` at the top level of `project/backend/`, and inside it a file
called `PaymentService.java`. Paste this code:

> 📌 **Why `review-samples/` and not `src/`?** Maven only compiles `src/main/java`. Keeping this
> file outside it means Copilot can still read and review it, but it will never be compiled or
> run — so your project keeps building. This code is deliberately unsafe; it is here to be
> reviewed, never executed.

```java
package nl.rabobank.casesummary.reviewsample;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void processPayment(String accountId, double amount) {
        String query = "SELECT * FROM accounts WHERE id = '" + accountId + "'";
        List<Map<String, Object>> result = jdbcTemplate.queryForList(query);

        if (!result.isEmpty()) {
            double balance = (double) result.get(0).get("balance");
            if (balance >= amount) {
                jdbcTemplate.update("UPDATE accounts SET balance = balance - " + amount +
                    " WHERE id = '" + accountId + "'");
                System.out.println("Payment processed: " + amount + " for account " + accountId);
            }
        }
    }
}
```

---

> ⚠️ **VS Code will show red squiggles on this file** — unresolved `org.springframework` imports,
> and a package that doesn't match its folder. That is expected: the file sits outside the Maven
> source root on purpose, so it is never compiled. Nothing is broken.

---

### Test A — Without the agent (baseline)

Open `PaymentService.java` in the editor so Copilot has it in context, set the agents dropdown to
**Ask**, then type:

```
Review this PaymentService code
```

Take 2 minutes to review the output:
- Did Copilot ask any clarifying questions?
- Did it identify the SQL injection risk?
- Did it flag the missing transaction handling?
- Was the review structured or scattered?

---

### Test B — With the agent

Custom agents are **selected**, not `@`-mentioned. (`@` in VS Code chat is reserved for the
built-in participants `@github`, `@terminal` and `@vscode` — typing `@backend-reviewer-ask` just
sends literal text.)

1. Open the **agents dropdown** in the Chat view — the selector in the chat input that currently
   says *Ask*, *Plan* or *Agent*
2. Choose **backend-reviewer-ask** from the list
3. Then type:

```
review #PaymentService.java
```

> 🔎 **Not in the list?** Run `/agents` in chat to open the Configure Custom Agents menu and check
> VS Code has picked up your file. Agent names are case-sensitive, and the file must sit in
> `.github/agents/` inside the folder you opened as your workspace.

Observe what happens **before** the review starts:
- Does the agent ask questions first?
- Are the questions relevant to a banking context?

Now answer the agent's questions. Example answers you can use:

```
- This is a payment processing service in a core banking system
- Runs as a Spring Boot microservice, called ~500 times/minute
- Handles real customer money — PII and financial data
- We use Spring, PostgreSQL, and an internal audit logging framework
- No distributed transactions currently in place
```

After answering, observe the full review output.

---

## 📊 Step 6 — Compare the Results

| Criteria | Without Agent | With Agent |
|----------|--------------|------------|
| Asked clarifying questions first | ❌ | ✅ |
| Identified SQL injection | ⚠️ maybe | ✅ always |
| Flagged missing transaction | ❌ | ✅ |
| Assessed load/performance risk | ❌ | ✅ |
| Output follows structured format | ❌ | ✅ |
| Tone appropriate for banking risk | ❌ | ✅ |

💬 **Discuss with your group:**
- Why does asking questions *before* reviewing improve the output?
- Which critical issue would have been missed without context?
- When would you use this agent vs. a plain Copilot prompt?

---

## 🚀 Step 7 — Now let Copilot build the next one

You wrote that file by hand on purpose: now you know what is inside one, so you know what to adjust
when an agent misbehaves. From here on, stop typing frontmatter *from scratch* — let Copilot draft it and then adjust.

### 7a — Generate a skill

A **skill** is knowledge, not a persona. You never call it — Copilot reads its description, decides
your task matches, and pulls it in. Make one for something your team already knows:

Switch the agents dropdown to **Agent** mode and send:

```
/create-skill

Create a skill that captures how this project handles customer data:
IBANs are masked in the service layer before they leave it, raw IBANs are never
logged, and a BSN is never logged at all. Reference the maskIban pattern in CaseService.
```

Copilot asks a couple of questions, then writes `.github/skills/<name>/SKILL.md`.

**Open it and look at the `description` line.** That line is not documentation — it is the trigger.
Copilot reads only the name and description to decide whether this skill is relevant, and loads the
body only if it decides yes. Write a vague description and this file will never be used again.

### 7b — Generate an agent

```
/create-agent

Create an agent that reviews Java code in this project against Rabobank banking
standards. It must ask me 3 questions about the code's purpose and data sensitivity
before it reviews anything, and report findings as Critical / Improvements / What is solid.
```

Compare the result with the file you wrote by hand. Same structure, thirty seconds instead of five
minutes — because you already knew what you were looking at.

### 7c — Wire the skill into the agent

There is **no `skills:` field** in agent frontmatter. Copilot decides on its own whether a skill is
relevant, which means it might not. If you want to be sure, say so explicitly — an agent may
reference other files, and yours has the `read` tool:

```markdown
Before you review anything, read
[our customer data rules](../skills/customer-data/SKILL.md)
and apply them to your findings.
```

**Where does that go?** Open the agent file `/create-agent` just wrote, and paste it as the first
line of the system prompt — directly below the closing `---` of the frontmatter. Save.

Adjust the path to the folder name `/create-skill` actually used.

> ℹ️ **No `tools:` line in your generated agent?** That is fine and common — it then has the
> default toolset and can already read files. Only if a `tools:` list *is* present does it need to
> include `read`.

### ▶️ Verify

Pick your generated agent from the dropdown and point it at a file that touches customer data:

```
review #CaseService.java
```

Then **expand the collapsed summary line** above the answer.

- `SKILL.md` in the references → the link worked; it read your team's rules before judging.
- Not there → check the relative path, and that the agent may `read`.

💬 **Discuss:** two ways to reach a skill. Hoping the description matches is convenient but not
guaranteed. Linking it from the agent is explicit and nearly always works. In a bank, which of
those two would you want your review process to depend on?

---

## 🔑 The Design Decisions Explained

| Decision | Why it matters |
|----------|---------------|
| **ASK before reviewing** | A payment service and a batch report need very different reviews — context changes everything |
| **`tools: ["read", "search"]`** | Allows the agent to pull in related files for deeper analysis |
| **Brutally honest personality** | Banking code reviews that soften bad news are dangerous — directness saves incidents |
| **Structured output format** | Reviewers and authors both need to act on feedback fast — structure removes ambiguity |
| **Banking-specific focus areas** | Generic reviewers miss PII handling, audit trails, and transaction integrity |

---

## 🧠 Key Takeaways

1. **Agents = reusable expertise** — write the prompt once, use it on every review
2. **Context first** — the same code means different things in a batch job vs. a real-time payment API
3. **Structured output = actionable output** — 🔥 Critical vs. ⚠️ Improvements lets teams prioritize correctly
4. **Agents can use tools** — `read` and `search` let the agent look beyond the single file you paste
5. **Personality matters** — a reviewer that sugarcoats issues in a banking environment creates risk

---

## ⚡ Bonus Challenge (optional)

Extend your agent in one of these directions:

### Option A — Add a Kotlin flavour
Add a section to the system prompt that handles Kotlin-specific patterns:

```markdown
## Kotlin-specific checks
- Prefer immutability (val over var) for financial state
- Flag nullable types on financial amounts (Double? is dangerous)
- Check coroutine scope — structured concurrency matters for transactions
```

### Option B — Add a compliance checklist
Add a mandatory output section:

```markdown
### 📋 Compliance checklist
- [ ] PII fields masked in logs
- [ ] All financial mutations covered by an audit trail
- [ ] No sensitive data in exception messages
- [ ] Input validated before hitting the database
```

### Option C — Scope to a stricter toolset
Change `tools` to `["read"]` only, and observe how the agent's analysis changes when it cannot search the broader codebase.

---

## 💬 Takeaway

> "A custom agent is not a smarter prompt — it is a specialist you hire once and deploy everywhere."
