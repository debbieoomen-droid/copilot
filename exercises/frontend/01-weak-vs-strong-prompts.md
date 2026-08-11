# 🧪 Exercise 1: From Weak → Strong Prompts (TypeScript)

## 🎯 Learning Objective
After this exercise, you will:
- Understand the difference between weak and strong prompts
- Learn how to guide GitHub Copilot / AI as a pair programmer
- Improve output quality by structuring prompts

---

## ⏱ Duration
10–15 minutes

---

## 🧩 Scenario (Rabobank-style)
You are building a simple feature for an internal banking tool.

Your task:
👉 Validate an IBAN number before processing a payment

This functionality must be reliable and production-ready.

---

## 🔹 Step 1 — Weak Prompt

Open GitHub Copilot Chat (Ask mode) and enter:

```
Create a function to validate an IBAN
```

### 👉 Observe the output
Take 2–3 minutes to review the result and answer:

- Is the solution complete?
- Does it handle invalid input (empty string, wrong format, lowercase)?
- Does it actually implement the checksum, or just a regex?
- Would you use this in a real banking application?

---

## 🔹 Step 2 — Strong Prompt

Now guide the AI like a senior developer would:

```
Create a TypeScript function called validateIban that validates IBAN numbers
using the official modulo 97 algorithm.

Requirements:
- Remove spaces from the input
- Convert the input to uppercase
- Check basic IBAN format (2 letters, 2 digits, alphanumeric rest, length 15–34)
- Perform the official MOD-97 validation
- Return true if valid, otherwise false
- Add clear comments in the code
- Include 3 example test cases:
  - one valid Dutch IBAN
  - one valid German IBAN
  - one invalid IBAN

Context:
This will be used in a banking application (Rabobank-like), so reliability is important.

Output:
Clean, production-ready TypeScript with type annotations.
```

---

## 🔍 Step 3 — Compare Results

| Criteria            | Weak Prompt | Strong Prompt |
|--------------------|------------|--------------|
| Completeness       | ❌ / ✅     | ✅            |
| Real MOD-97 checksum | ❌       | ✅            |
| Handles messy input | ❌         | ✅            |
| Typed & readable   | ⚠️         | ✅            |
| Production-ready   | ❌         | ✅            |

### 💬 Discussion questions
- What improved the most?
- Which part of the prompt made the biggest difference?
- What would you still improve?

---

## 🧠 Key Insight

AI works best when you:
- Define a role
- Provide clear requirements
- Add context
- Specify the expected output

👉 You are not prompting a tool
👉 You are guiding a developer

---

## ⚡ Bonus Challenge (optional)

Enhance your prompt even further. Try adding:
- Country-specific IBAN length rules (NL = 18, DE = 22)
- A typed result object with an error reason instead of just true/false
- Unit test structure (vitest — already configured in the `project/frontend` folder)

---

## 💬 Takeaway

> "Better prompts don't just ask — they define role, context, and expectations."
