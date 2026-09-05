# 🧪 Exercise 1 — From Weak to Strong Prompts (TypeScript)

> **Your track today:** Exercise 1 of 3 · next up is `exercises/frontend/02`

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

## ⚠️ Before you start — close the course project

**Do this exercise with no project folder open**, or with an empty folder. In VS Code:
**File → Close Folder**.

Why: Copilot's Ask mode now searches your open codebase automatically, without you asking it to.
The course project already contains a finished IBAN validator — so if it is open, Copilot finds it
and answers *"this is already implemented, here it is"* instead of writing you a naive one. That is
genuinely useful behaviour, but it removes the entire point of this exercise, which is to see what
a lazy prompt produces from nothing.

> 💡 **If it happens anyway** and Copilot points you at existing code: that in itself is worth
> noticing — it just demonstrated that context changes the answer more than wording does. Close the
> folder and run the prompt again to get the comparison this exercise is built on.

---

## 🔹 Step 1 — Weak Prompt

Open GitHub Copilot Chat (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>I</kbd>) and make sure the
**agents dropdown says Ask**. Then enter this exactly as written — do not improve it:

```
Create a function to validate IBAN
```

> ℹ️ **Ask mode cannot change your files.** It only writes text into the chat panel, so
> nothing you do in this exercise can touch the project. That is why Ask is the safe default
> and where everyone starts. **Agent** mode is the one that edits code — later today.

### 👉 Observe the output
Take 2–3 minutes to review the result and answer:

- Is the solution complete?
- Does it handle invalid input (empty string, wrong format, lowercase)?
- Does it really check the number is valid, or only that it *looks* like an IBAN?
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

## ▶️ Step 4 — Actually run it

Comparing two answers on screen is useful. Watching one of them pass its own tests is better.

TypeScript can't run straight in a browser, so ask Copilot for a runnable version — no build
tools, no setup:

```
Give me that same validateIban function as plain JavaScript with no type annotations,
plus the three test cases as console.log lines, so I can paste it straight into the
browser console.
```

Then:

1. Open any page (the Case Summary app is fine) and press <kbd>F12</kbd> to open DevTools
2. Click the **Console** tab
3. Paste what Copilot gave you and press Enter

You should see the valid Dutch and German IBANs return `true` and the invalid one return `false`.

> 💡 **Nothing gets saved and nothing is added to the app.** The console is a scratchpad — reload
> the page and it's gone. This exercise is deliberately standalone: you are testing a prompt, not
> adding a feature. The app itself comes next, in Exercise 2.

### 👉 Now the real question

Copilot wrote both the code **and** the tests that check it. So:

- If the tests pass, what exactly has that proven?
- What would it take to actually trust this in a payment flow?
- Try feeding it a valid IBAN it has never seen — does it still hold up?

💬 **Discuss:** an AI that writes its own exam and then marks it is not the same as a verified
implementation. This is the habit to take home: generated tests tell you the code does what the
model *thought* you wanted.

---

## ⚡ Bonus Challenge (optional)

Enhance your prompt even further. Try adding:
- Country-specific IBAN length rules (NL = 18, DE = 22)
- A typed result object with an error reason instead of just true/false
- Unit test structure (vitest — run `npm install` once in `project/frontend/` first)

---

## 💬 Takeaway

> "Better prompts don't just ask — they define role, context, and expectations."
