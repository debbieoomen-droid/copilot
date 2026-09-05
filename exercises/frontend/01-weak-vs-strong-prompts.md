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
You are building a validation step for an internal onboarding form.

Your task:
👉 **Validate a Dutch BSN** (burgerservicenummer) before the form is submitted

A BSN is the Dutch citizen service number — nine digits, and banks validate it during KYC checks.
It is **personal data**, so getting this wrong has consequences beyond a failing test.

---

## 🔹 Step 1 — Weak Prompt

Open GitHub Copilot Chat (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>I</kbd>) and make sure the
**agents dropdown says Ask**. Then enter this exactly as written — do not improve it:

```
Create a function to validate a BSN
```

> ℹ️ **Ask mode cannot change your files.** It only writes text into the chat panel, so nothing you
> do in this exercise can touch the project. That is why Ask is the safe default and where everyone
> starts. **Agent** mode is the one that edits code — later today.

### 👉 Observe the output
Take 2–3 minutes to review the result and answer:

- Is the solution complete?
- Does it handle invalid input (empty string, letters, wrong length)?
- **Does it actually check the number is valid — or only that it has nine digits?**
- Would you use this in a real onboarding form?

---

## 🔹 Step 2 — Strong Prompt

Now guide the AI like a senior developer would:

```
Act as a senior front-end developer.

Create a TypeScript function called validateBsn that validates a Dutch BSN
using the official "elfproef" (11-test).

Requirements:
- Return false for null, undefined or an empty string
- Remove all spaces
- Accept exactly 9 digits, and keep any leading zero
- Reject a BSN consisting only of zeros
- Multiply digits 1 to 8 by the weights 9, 8, 7, 6, 5, 4, 3, 2
- Multiply the 9th digit by -1
- The BSN is valid when the sum of those products is divisible by 11
- Add clear comments in the code
- Include 3 example test cases:
  two valid BSNs and one that has nine digits but fails the elfproef

Context:
This will be used in a banking application (Rabobank-like) during customer
onboarding, so reliability is important.

Output:
Clean, production-ready TypeScript with type annotations.
```

---

## 🔍 Step 3 — Compare Results

| Criteria | Weak Prompt | Strong Prompt |
|---|---|---|
| Completeness | ❌ / ✅ | ✅ |
| **Real elfproef checksum** | ❌ usually just a 9-digit check | ✅ |
| Handles messy input | ❌ | ✅ |
| Typed & readable | ⚠️ | ✅ |
| Production-ready | ❌ | ✅ |

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
Give me that same validateBsn function as plain JavaScript with no type annotations,
plus the three test cases as console.log lines, so I can paste it straight into the
browser console.
```

Then:

1. Open any page and press <kbd>F12</kbd> to open DevTools
2. Click the **Console** tab
3. Paste what Copilot gave you and press Enter

> 💡 **Nothing gets saved and nothing is added to the app.** The console is a scratchpad — reload
> the page and it's gone. This exercise is deliberately standalone: you are testing a prompt, not
> adding a feature. The app itself comes next, in Exercise 2.

### 🧪 Now test the weak one with the same numbers

This is the moment the exercise is built around. Take these three and try them **against both** of
your implementations:

| BSN | Nine digits? | Actually valid? |
|---|---|---|
| `111222333` | yes | ✅ valid |
| `123456782` | yes | ✅ valid |
| **`123456789`** | **yes** | **❌ invalid — fails the elfproef** |

The weak version almost certainly accepts `123456789`, because it only ever checked that the input
*looks* like a BSN. The strong version rejects it.

> That third number is the whole lesson. It is not malformed. It is not obviously wrong. It would
> sail through a code review. And it is not a real BSN.

### 👉 Now the real question

Copilot wrote both the code **and** the tests that check it. So:

- If the tests pass, what exactly has that proven?
- What would it take to actually trust this in an onboarding form?
- Try feeding it a valid BSN it has never seen — does it still hold up?

💬 **Discuss:** an AI that writes its own exam and then marks it is not the same as a verified
implementation. This is the habit to take home: generated tests tell you the code does what the
model *thought* you wanted.

---

## ⚡ Bonus Challenge (optional)

Enhance your prompt even further. Try adding:
- A typed result object with an error reason instead of just true/false
- An inline error message next to the field, announced to screen readers with `aria-live`
- Never logging the BSN itself, because it is personal data
- Unit test structure (vitest — run `npm install` once in `project/frontend/` first)

---

## 💬 Takeaway

> "Better prompts don't just ask — they define role, context, and expectations."
