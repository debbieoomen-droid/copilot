# 🧪 Exercise 2 — Build a Custom Backend Reviewer Agent in VS Code

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
backend-reviewer-ask.md
```

Your file path should be:

```
.github/agents/backend-reviewer-ask.md
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

Your finished `backend-reviewer-ask.md` should look exactly like this:

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

Create a new file in your project called `PaymentService.java` and paste this code:

```java
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

### Test A — Without the agent (baseline)

Open Copilot Chat and type:

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

Open Copilot Chat and invoke your agent:

```
@backend-reviewer-ask review PaymentService.java
```

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
